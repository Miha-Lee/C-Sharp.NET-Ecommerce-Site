namespace EcommerceSystem.Models
{
    public class Cart
    {
        public int id { get; set; }
        public int quantity { get; set; }
        public string? title { get; set; }
        public long unit_price { get; set; }
    }
}