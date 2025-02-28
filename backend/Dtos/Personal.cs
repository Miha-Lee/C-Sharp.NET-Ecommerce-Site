namespace EcommerceSystem.Dtos
{
    public partial class Personal
    {
        public string First_Name;
        public string Last_Name;
        public DateTime Created_at;

        public Personal()
        {
            if (First_Name == null)
            {
                First_Name = "";
            }

            if (Last_Name == null)
            {
                Last_Name = "";
            }
        }
    }
}