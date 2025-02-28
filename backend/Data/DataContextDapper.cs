using System.Data;
using Dapper;
using Microsoft.Data.SqlClient;

namespace EcommerceSystem.Data
{
    class DataContextDapper
    {
        private readonly IDbConnection _dbConnection;

        public DataContextDapper(IConfiguration config)
        {
            _dbConnection = new SqlConnection(config.GetConnectionString("DefaultConnection"));
        }

        public IEnumerable<T> LoadData<T>(string sql)
        {
            return _dbConnection.Query<T>(sql);
        }

        public T LoadDataSingle<T>(string sql)
        {
            return _dbConnection.QuerySingle<T>(sql);
        }

        public bool ExecuteSql(string sql)
        {
            return _dbConnection.Execute(sql) > 0;
        }

        public T? LoadDataSingleCheck<T>(string sql)
        {
            return _dbConnection.QueryFirstOrDefault<T>(sql);
        }

        public bool ExecuteSqlWithParams(string sql, DynamicParameters parameters)
        {
            return _dbConnection.Execute(sql, parameters) > 0;
        }
    }
}