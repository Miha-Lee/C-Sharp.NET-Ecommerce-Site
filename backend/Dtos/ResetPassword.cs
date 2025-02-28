namespace EcommerceSystem.Dtos
{
    public partial class ResetPassword
    {
        public string Password { get; set; }
        public string Password_Confirm { get; set; }

        public ResetPassword()
        {
            if (Password == null)
            {
                Password = "";
            }

            if (Password_Confirm == null)
            {
                Password_Confirm = "";
            }
        }
    }
}