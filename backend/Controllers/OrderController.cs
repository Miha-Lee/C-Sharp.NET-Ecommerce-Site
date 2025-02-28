using EcommerceSystem.Data;
using EcommerceSystem.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Stripe;
using Stripe.Checkout;

namespace EcommerceSystem.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class OrderController : ControllerBase
    {
        private readonly DataContextDapper _dapper;
        private readonly IConfiguration _config;

        public OrderController(IConfiguration config)
        {
            _dapper = new DataContextDapper(config);
            _config = config;
        }

        [HttpPost("OrderCheckout")]
        public IActionResult OrderCheckout(OrderCheckout orderCheckout)
        {
            string userCheck = @$"
                SELECT
                    Email
                FROM EcommerceSystemApp.Users
                WHERE User_id = {this.User.FindFirst("userId")?.Value}
            ";

            if (_dapper.LoadDataSingleCheck<string>(userCheck) == null)
            {
                return Ok(new
                {
                    Success = false,
                    User = true,
                    Message = "User cannot be found",
                });
            }

            string? frontendHost = _config.GetSection("FrontendHost").Value;

            StripeConfiguration.ApiKey = _config["Stripe:SecretKey"];
            var options = new SessionCreateOptions
            {
                PaymentMethodTypes = new List<string> { "card" },
                LineItems = new List<SessionLineItemOptions>(),
                Mode = "payment",
                CustomerEmail = orderCheckout.Email,
                Locale = "en",
                SuccessUrl = $"{frontendHost}/success",
                CancelUrl = $"{frontendHost}/cancel"
            };

            if (orderCheckout.Cart != null)
            {
                foreach (var cartItem in orderCheckout.Cart)
                {
                    options.LineItems.Add(new SessionLineItemOptions
                    {
                        PriceData = new SessionLineItemPriceDataOptions
                        {
                            UnitAmount = cartItem.unit_price,
                            Currency = "usd",
                            ProductData = new SessionLineItemPriceDataProductDataOptions
                            {
                                Name = cartItem.title
                            }
                        },
                        Quantity = cartItem.quantity
                    });
                }
            }

            var service = new SessionService();
            Session session = service.Create(options);

            string? shippingType = null;

            if (orderCheckout.Delivery == 1)
            {
                shippingType = "pickup_from_store";
            }
            else if (orderCheckout.Delivery == 2)
            {
                shippingType = "delivery_in_city";
            }
            else
            {
                shippingType = "regional_delivery";
            }

            string addressCreate = @$"
                INSERT INTO EcommerceSystemApp.Addresses
                (
                    First_Name,
                    Last_Name,
                    Phone_Number,
                    Email,
                    Shipping_Type,
                    Street,
                    House,
                    Building,
                    Entrance,
                    Floor,
                    Apartment,
                    Country,
                    City,
                    Post_Code,
                    Comment,
                    Created_at,
                    Updated_at
                )
                VALUES
                (
                    '{orderCheckout.First_Name}',
                    '{orderCheckout.Last_Name}',
                    '{orderCheckout.Phone_Number}',
                    '{orderCheckout.Email}',
                    '{shippingType}',
                    '{orderCheckout.Street}',
                    '{orderCheckout.House}',
                    '{orderCheckout.Building}',
                    '{orderCheckout.Entrance}',
                    '{orderCheckout.Floor}',
                    '{orderCheckout.Apartment}',
                    '{orderCheckout.Country}',
                    '{orderCheckout.City}',
                    '{orderCheckout.Post_Code}',
                    '{orderCheckout.Comment}',
                    GETDATE(),
                    GETDATE()
                )
            ";

            if (_dapper.ExecuteSql(addressCreate))
            {
                int numOfItems = 0;
                float total = 0f;

                if (orderCheckout.CartArr != null)
                {
                    foreach (var product in orderCheckout.CartArr)
                    {
                        numOfItems += product.quantity;
                        total += product.quantity * product.unit_price;
                    }
                }

                string latestAddress = @$"
                    SELECT 
                        TOP 1
                        Address_id
                    FROM EcommerceSystemApp.Addresses
                    ORDER BY Address_id DESC 
                ";

                int addressId = _dapper.LoadDataSingle<int>(latestAddress);

                string orderCreate = @$"    
                    INSERT INTO EcommerceSystemApp.Orders
                    (
                        User_id,
                        Total,
                        Address_id,
                        Num_Of_Items,
                        Product,
                        Payment_Status,
                        Session_id,
                        Created_at,
                        Updated_at
                    )
                    VALUES
                    (
                        {this.User.FindFirst("userId")?.Value},
                        {(decimal)total},
                        {addressId},
                        {numOfItems},
                        '{orderCheckout.jsonStringArr}',
                        0,
                        '{session.Id}',
                        GETDATE(),
                        GETDATE()
                    )
                ";

                if (_dapper.ExecuteSql(orderCreate))
                {
                    return Ok(new
                    {
                        Success = true,
                        Id = session.Id,
                    });
                }
            }

            return Ok(new
            {
                Success = false,
                User = false,
                Message = "Not Able to Checkout",
            });
        }

        [AllowAnonymous]
        [HttpPost("WebHook")]
        public async Task<IActionResult> OrderWebhook()
        {
            string? webhookKey = _config.GetSection("Webhook:SigningKey").Value;
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();

            try
            {
                var stripeEvent = EventUtility.ConstructEvent(json, Request.Headers["Stripe-Signature"], webhookKey);

                if (stripeEvent.Type == "checkout.session.completed")
                {
                    var session = stripeEvent.Data.Object as Session;

                    if (session != null)
                    {
                        string sql = @$"
                            UPDATE EcommerceSystemApp.Orders
                                SET Payment_Status = 1,
                                    Updated_at = GETDATE()
                            WHERE Session_id = '{session.Id}'
                        ";

                        _dapper.ExecuteSql(sql);
                    }
                }

                return Ok();
            }
            catch (StripeException e)
            {
                Console.WriteLine($"Stripe exception: {e.Message}");

                return BadRequest();
            }
        }

        [HttpGet("GetOrders")]
        public IActionResult GetOrders()
        {
            string sql = @$"
                SELECT 
                    Orders.Order_id,
                    Orders.Num_Of_Items AS Items,
                    Addresses.Shipping_Type AS Shipping,
                    Orders.Total,
                    Orders.Created_at
                FROM EcommerceSystemApp.Orders 
                JOIN EcommerceSystemApp.Addresses ON 
                        Orders.Address_id = Addresses.Address_id
                WHERE Orders.User_id = {this.User.FindFirst("userId")?.Value} 
                      AND
                      Orders.Payment_Status = 1
            ";

            IEnumerable<Orders> orders = _dapper.LoadData<Orders>(sql);

            string personalSql = @$"
                    SELECT First_Name,
                           Last_Name,
                           Created_at
                    FROM EcommerceSystemApp.Users
                    WHERE User_id = {this.User.FindFirst("userId")?.Value}
                ";

            Personal? personal = _dapper.LoadDataSingleCheck<Personal>(personalSql);

            if (personal == null)
            {
                return Ok(new
                {
                    Success = false,
                    Message = "User cannot be found",
                });
            }

            return Ok(new
            {
                Success = true,
                Orders = orders,
                Personal = new
                {
                    First_Name = personal?.First_Name,
                    Last_Name = personal?.Last_Name,
                    Created_at = personal?.Created_at
                }
            });
        }

        [HttpGet("GetOrder/{order_id}")]
        public IActionResult GetOrder(int order_id)
        {
            string personalSql = @$"
                    SELECT First_Name,
                           Last_Name,
                           Created_at
                    FROM EcommerceSystemApp.Users
                    WHERE User_id = {this.User.FindFirst("userId")?.Value}
                ";

            Personal? personal = _dapper.LoadDataSingleCheck<Personal>(personalSql);

            if (personal == null)
            {
                return Ok(new
                {
                    Success = false,
                    User = true,
                    Message = "User cannot be found",
                });
            }

            string orderDetailSql = @$"
                SELECT 
                    Orders.Order_id,
                    Addresses.First_Name,
                    Addresses.Last_Name,
                    Addresses.Phone_Number,
                    Addresses.Email,
                    Addresses.Shipping_Type,
                    Addresses.Street,
                    Addresses.House,
                    Addresses.Building,
                    Addresses.Entrance,
                    Addresses.Floor,
                    Addresses.Apartment,
                    Addresses.Country,
                    Addresses.City,
                    Addresses.Post_Code,
                    Addresses.Comment,
                    Orders.Total,
                    Orders.Product,
                    Orders.Created_at
                FROM EcommerceSystemApp.Orders 
                JOIN EcommerceSystemApp.Addresses ON 
                     Orders.Address_id = Addresses.Address_id
                WHERE Orders.Order_id = {order_id}
            ";

            OrderDetail? orderDetail = _dapper.LoadDataSingleCheck<OrderDetail>(orderDetailSql);

            if (orderDetail == null)
            {
                return Ok(new
                {
                    Success = false,
                    User = false,
                    Message = "Order cannot be found",
                });
            }

            return Ok(new
            {
                Success = true,
                OrderDetail = orderDetail,
                Personal = new
                {
                    First_Name = personal?.First_Name,
                    Last_Name = personal?.Last_Name,
                    Created_at = personal?.Created_at
                }
            });
        }
    }
}