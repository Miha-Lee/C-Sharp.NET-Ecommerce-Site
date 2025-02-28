namespace EcommerceSystem.Dtos
{
    public partial class Login
    {
        public string Email { get; set; }
        public string Password { get; set; }

        public Login()
        {
            if (Email == null)
            {
                Email = "";
            }

            if (Password == null)
            {
                Password = "";
            }
        }
    }
}