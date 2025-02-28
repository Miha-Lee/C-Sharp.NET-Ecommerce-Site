namespace EcommerceSystem.Dtos
{
    public partial class UserDetail
    {
        public string First_Name { get; set; }
        public string Last_Name { get; set; }
        public string Phone_Number { get; set; }
        public DateTime Date_of_birth { get; set; }
        public string Country { get; set; }
        public DateTime Created_at { get; set; }

        public UserDetail()
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

            if (Country == null)
            {
                Country = "";
            }
        }
    }
}