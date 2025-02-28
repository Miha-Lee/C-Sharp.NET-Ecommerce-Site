namespace EcommerceSystem.Dtos
{
    public partial class OrderDetail
    {
        public int Order_id { get; set; }
        public string? First_Name { get; set; }
        public string? Last_Name { get; set; }
        public string? Phone_Number { get; set; }
        public string? Email { get; set; }
        public string? Shipping_Type { get; set; }
        public string? Street { get; set; }
        public string? House { get; set; }
        public string? Building { get; set; }
        public string? Entrance { get; set; }
        public string? Floor { get; set; }
        public string? Apartment { get; set; }
        public string? Country { get; set; }
        public string? City { get; set; }
        public string? Post_Code { get; set; }
        public string? Comment { get; set; }
        public decimal Total { get; set; }
        public string? Product { get; set; }
        public DateTime Created_at { get; set; }
    }
}