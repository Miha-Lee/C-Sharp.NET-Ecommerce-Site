namespace EcommerceSystem.Dtos
{
    public partial class Orders
    {
        public int Order_id { get; set; }
        public int Items { get; set; }
        public string Shipping { get; set; }
        public decimal Total { get; set; }
        public DateTime Created_at { get; set; }

        public Orders()
        {
            if (Shipping == null)
            {
                Shipping = "";
            }
        }
    }
}