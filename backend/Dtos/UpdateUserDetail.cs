namespace EcommerceSystem.Dtos
{
    public partial class UpdateUserDetail
    {
        public string First_Name { get; set; }
        public string Last_Name { get; set; }
        public string Phone_Number { get; set; }
        public string Date_of_birth { get; set; }
        public string Country { get; set; }

        public UpdateUserDetail()
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

            if (Date_of_birth == null)
            {
                Date_of_birth = "";
            }

            if (Country == null)
            {
                Country = "";
            }
        }
    }
}