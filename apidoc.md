\*GetAllUser/ (GET)

http://localhost:5000/api/auth/users

/\*Register/ (POST)

http://localhost:5000/api/auth/register (body) => {"name":"remo", "email":"remo@gmail.com", "password": "1234"}

\*Login (POST)

http://localhost:5000/api/auth/login (body) => {"email":"aa@gmail.com","password":"12345678"} (response)=> {auth:true,token:'dgsdg'}

/\*UserInfo/ (GET)

http://localhost:5000/api/auth/userInfo (Header) => {'x-access-token':'token value from login'}
