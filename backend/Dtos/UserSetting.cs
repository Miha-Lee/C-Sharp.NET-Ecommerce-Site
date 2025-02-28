namespace EcommerceSystem.Dtos
{
    public partial class UserSetting
    {
        public string Email;
        public string First_Name;
        public string Last_Name;
        public DateTime Created_at;

        public UserSetting()
        {
            if (Email == null)
            {
                Email = "";
            }

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