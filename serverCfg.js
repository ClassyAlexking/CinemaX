var config = {  
    server: 'DESKTOP-95RS3A4\\SQLEXPRESS',  //change
    authentication: {
        type: 'default',
        options: {
            userName: 'sa', //change if needed
            password: '1234'  //change if needed
        }
    },
    options: {
        // If you are on Microsoft Azure, you need encryption:
        encrypt: true,
        trustServerCertificate: true,
        database: 'CinemaX'  //update me
    }
}; 

module.exports = { config };