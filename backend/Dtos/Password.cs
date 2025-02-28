namespace EcommerceSystem.Dtos
{
    public partial class Password
    {
        public int User_id;
        public byte[] Password_Hash;
        public byte[] Password_Salt;

        public Password()
        {
            if (Password_Hash == null)
            {
                Password_Hash = new byte[0];
            }

            if (Password_Salt == null)
            {
                Password_Salt = new byte[0];
            }
        }
    }
}