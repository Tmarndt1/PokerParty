namespace Poker.Library.Utilities
{
    public class Result
    {
        public bool Success { get; set; }

        public string Error { get; set; }

        public Result() { }

        public Result(bool success)
        {
            Success = success;
        }

        public Result(bool success, string error) : this(success)
        {
            Error = error;
        }
    }

    public class Result<T> : Result
    {
        public T Data { get; set; }

        public Result(T data)
        {
            Data = data;
        }

        public Result(T data, bool success) : this(data)
        {
            Success = success;
        }

        public Result(T data, bool success, string error) : this(data, success)
        {
            Error = error;
        }
    }
}
