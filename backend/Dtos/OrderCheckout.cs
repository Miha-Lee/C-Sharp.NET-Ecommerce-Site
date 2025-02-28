using EcommerceSystem.Models;

namespace EcommerceSystem.Dtos
{
    public partial class OrderCheckout
    {
        public string First_Name { get; set; }
        public string Last_Name { get; set; }
        public string Phone_Number { get; set; }
        public string Email { get; set; }
        public string Street { get; set; }
        public string House { get; set; }
        public string Building { get; set; }
        public string Entrance { get; set; }
        public string Floor { get; set; }
        public string Apartment { get; set; }
        public string Comment { get; set; }
        public string Country { get; set; }
        public string City { get; set; }
        public string Post_Code { get; set; }
        public List<Cart>? Cart { get; set; }
        public int Delivery { get; set; }
        public List<CartJson>? CartArr { get; set; }
        public string jsonStringArr { get; set; }

        public OrderCheckout()
        {
            if (First_Name == null)
            {
                First_Name = "";
            }

            if (Last_Name == null)
            {
                Last_Name = "";
            }

            if (Phone_Number == null)
            {
                Phone_Number = "";
            }

            if (Email == null)
            {
                Email = "";
            }

            if (Street == null)
            {
                Street = "";
            }

            if (House == null)
            {
                House = "";
            }

            if (Building == null)
            {
                Building = "";
            }

            if (Entrance == null)
            {
                Entrance = "";
            }

            if (Floor == null)
            {
                Floor = "";
            }

            if (Apartment == null)
            {
                Apartment = "";
            }

            if (Comment == null)
            {
                Comment = "";
            }

            if (Country == null)
            {
                Country = "";
            }

            if (City == null)
            {
                City = "";
            }

            if (Post_Code == null)
            {
                Post_Code = "";
            }

            if (jsonStringArr == null)
            {
                jsonStringArr = "";
            }
        }
    }
}