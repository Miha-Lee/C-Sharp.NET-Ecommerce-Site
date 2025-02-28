namespace EcommerceSystem.Models
{
    public class CartJson
    {
        public int id { get; set; }
        public int quantity { get; set; }
        public string? title { get; set; }
        public float unit_price { get; set; }
    }
}