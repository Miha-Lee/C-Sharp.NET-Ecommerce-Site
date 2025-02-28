using System.Data;
using System.Security.Cryptography;
using Dapper;
using EcommerceSystem.Data;
using EcommerceSystem.Dtos;
using EcommerceSystem.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EcommerceSystem.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]

    public class AuthController : ControllerBase
    {
        private readonly DataContextDapper _dapper;
        private readonly AuthHelper _authHelper;

        public AuthController(IConfiguration config)
        {
            _dapper = new DataContextDapper(config);
            _authHelper = new AuthHelper(config);
        }

        [AllowAnonymous]
        [HttpPost("Register")]
        public IActionResult Register(Register register)
        {
            if (register.Password != register.PasswordConfirm)
            {
                return Ok(new
                {
                    Success = false,
                    Message = "Password and Password Confirm are not matched"
                });
            }

            if (register.Password.Length < 8)
            {
                return Ok(new
                {
                    Success = false,
                    Message = "Password should at least has 8 characters"
                });
            }

            string sqlUserCheck = @$"
                SELECT Email FROM EcommerceSystemApp.Users
                WHERE Email = '{register.Email}'
            ";

            if (_dapper.LoadDataSingleCheck<string>(sqlUserCheck) == null)
            {
                byte[] passwordSalt = new byte[128 / 8];

                using (RandomNumberGenerator rng = RandomNumberGenerator.Create())
                {
                    rng.GetNonZeroBytes(passwordSalt);
                }

                byte[] passwordHash = _authHelper.GetPasswordHash(register.Password, passwordSalt);

                string sqlAddAuth = @$"
                    INSERT INTO EcommerceSystemApp.Users
                    (
                        Email,
                        First_Name,
                        Last_Name,
                        Phone_Number,
                        Date_of_birth,
                        Country,
                        Password_Hash,
                        Password_Salt,
                        Created_at,
                        Updated_at
                    )
                    VALUES
                    (
                        '{register.Email}',
                        '{register.First_Name}',
                        '{register.Last_Name}',
                        '{register.Phone_Number}',
                        '{register.Date_of_birth}',
                        '{register.Country}',
                        @PasswordHashParam,
                        @PasswordSaltParam,
                        GETDATE(),
                        GETDATE()
                    )
                ";

                DynamicParameters parameters = new DynamicParameters();
                parameters.Add("@PasswordHashParam", passwordHash, DbType.Binary);
                parameters.Add("@PasswordSaltParam", passwordSalt, DbType.Binary);

                if (_dapper.ExecuteSqlWithParams(sqlAddAuth, parameters))
                {
                    return Ok(new
                    {
                        Success = true,
                        Message = "Registered Successfully"
                    });
                }

                throw new Exception("Unable to register the user");
            }

            return Ok(new
            {
                Success = false,
                Message = "Email has been registered"
            });
        }

        [AllowAnonymous]
        [HttpPost("Login")]
        public IActionResult Login(Login login)
        {
            string sqlEmailCheck = @$"
                SELECT 
                    User_id,
                    Password_Hash,
                    Password_Salt
                FROM EcommerceSystemApp.Users
                WHERE Email = '{login.Email}'
            ";

            Password? password = _dapper.LoadDataSingleCheck<Password>(sqlEmailCheck);

            if (password == null)
            {
                return Ok(new
                {
                    Success = false,
                    Message = "Email has not been registered"
                });
            }

            byte[] passwordHash = _authHelper.GetPasswordHash(login.Password, password.Password_Salt);

            for (int i = 0; i < passwordHash.Length; i++)
            {
                if (passwordHash[i] != password.Password_Hash[i])
                {
                    return Ok(new
                    {
                        Success = false,
                        Message = "Incorrect password"
                    });
                }
            }

            return Ok(new
            {
                Success = true,
                Message = "Login Successfully",
                Token = _authHelper.CreateToken(password.User_id),
            });
        }

        [HttpGet("UserDetail")]
        public IActionResult GetUserDetail()
        {
            string sql = @$"
                SELECT 
                    First_Name,
                    Last_Name,
                    Phone_Number,
                    Date_of_birth,
                    Country,
                    Created_at
                FROM EcommerceSystemApp.Users
                WHERE User_id = {this.User.FindFirst("userId")?.Value}
            ";

            UserDetail? userDetail = _dapper.LoadDataSingleCheck<UserDetail>(sql);

            if (userDetail == null)
            {
                return Ok(new
                {
                    Success = false,
                    Message = "User cannot be found",
                });
            }

            return Ok(new
            {
                Success = true,
                UserDetail = userDetail
            });
        }

        [HttpPut("UpdateUserDetail")]
        public IActionResult UpdateUserDetail(UpdateUserDetail userDetailEdit)
        {
            string sql = @$"
                SELECT 
                    First_Name,
                    Last_Name,
                    Phone_Number,
                    Date_of_birth,
                    Country,
                    Created_at
                FROM EcommerceSystemApp.Users
                WHERE User_id = {this.User.FindFirst("userId")?.Value}
            ";

            UserDetail? userDetail = _dapper.LoadDataSingleCheck<UserDetail>(sql);

            if (userDetail == null)
            {
                return Ok(new
                {
                    Success = false,
                    Message = "User cannot be found",
                });
            }

            string updateUserDetail = @$"
                UPDATE EcommerceSystemApp.Users 
                    SET First_Name = '{userDetailEdit.First_Name}',
                        Last_Name = '{userDetailEdit.Last_Name}',
                        Phone_Number = '{userDetailEdit.Phone_Number}',
                        Date_of_birth = '{userDetailEdit.Date_of_birth}',
                        Country = '{userDetailEdit.Country}',
                        Updated_at = GETDATE()
                    WHERE User_id = {this.User.FindFirst("userId")?.Value}          
            ";


            if (_dapper.ExecuteSql(updateUserDetail))
            {
                string personalSql = @$"
                    SELECT First_Name,
                           Last_Name,
                           Created_at
                    FROM EcommerceSystemApp.Users
                    WHERE User_id = {this.User.FindFirst("userId")?.Value}
                ";

                Personal? personal = _dapper.LoadDataSingleCheck<Personal>(personalSql);

                return Ok(new
                {
                    Success = true,
                    Message = "Update the User Detail Success",
                    Personal = new
                    {
                        First_Name = personal?.First_Name,
                        Last_Name = personal?.Last_Name,
                        Created_at = personal?.Created_at
                    }
                });
            }

            throw new Exception("Unable to update the user detail");
        }

        [HttpGet("UserSettingDetail")]
        public IActionResult UserSettingDetail()
        {
            string sql = @$"
                SELECT 
                    Email,
                    First_Name,
                    Last_Name,
                    Created_at
                FROM EcommerceSystemApp.Users
                WHERE User_id = {this.User.FindFirst("userId")?.Value}
            ";

            UserSetting? userSetting = _dapper.LoadDataSingleCheck<UserSetting>(sql);

            if (userSetting == null)
            {
                return Ok(new
                {
                    Success = false,
                    Message = "User cannot be found",
                });
            }

            return Ok(new
            {
                Success = true,
                UserSetting = new
                {
                    Email = userSetting.Email,
                    First_Name = userSetting.First_Name,
                    Last_Name = userSetting.Last_Name,
                    Created_at = userSetting.Created_at
                }
            });
        }

        [HttpPut("ResetPassword")]
        public IActionResult ResetPassword(ResetPassword resetPassword)
        {
            if (resetPassword.Password != resetPassword.Password_Confirm)
            {
                return Ok(new
                {
                    Success = false,
                    Title = "Error",
                    Message = "Password and Confirm Password are not matched",
                });
            }

            if (resetPassword.Password.Length < 8)
            {
                return Ok(new
                {
                    Success = false,
                    Title = "Error",
                    Message = "Password should at least has 8 characters",
                });
            }

            string userCheckSql = @$"
                SELECT 
                    Email
                FROM EcommerceSystemApp.Users
                WHERE User_id = {this.User.FindFirst("userId")?.Value}
            ";

            string? userCheck = _dapper.LoadDataSingleCheck<string>(userCheckSql);

            if (userCheck == null)
            {
                return Ok(new
                {
                    Success = false,
                    Title = "Please Login again",
                    Message = "User cannot be found",
                });
            }

            byte[] passwordSalt = new byte[128 / 8];

            using (RandomNumberGenerator rng = RandomNumberGenerator.Create())
            {
                rng.GetNonZeroBytes(passwordSalt);
            }

            byte[] passwordHash = _authHelper.GetPasswordHash(resetPassword.Password, passwordSalt);

            string sqlUpdateAuth = @$"
                UPDATE EcommerceSystemApp.Users
                SET 
                    Password_Hash = @passwordHashParam,
                    Password_Salt = @passwordSaltParam
                WHERE User_id = {this.User.FindFirst("userId")?.Value}
            ";

            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@passwordHashParam", passwordHash, DbType.Binary);
            parameters.Add("@passwordSaltParam", passwordSalt, DbType.Binary);

            if (_dapper.ExecuteSqlWithParams(sqlUpdateAuth, parameters))
            {
                return Ok(new
                {
                    Success = true,
                    Message = "Reset the password success"
                });
            }

            throw new Exception("Unable to reset the password");
        }
    }
}