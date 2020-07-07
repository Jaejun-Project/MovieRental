
//POST /api/returns {customerId, movieId}

//  Return 401 or unauthorized if client is not logged in
//  Return 400 (bad request) if customerID is not provided
//  Return 400 if movieId is not provided 
//  Return 404 if no rental found for this customer/movie
//  Return 400 if rental already processed

//  Return 200 if valid request
//  Set the reutnr date
//  Calculate the rental fee (numberofDays * movie.dailyrentalrate)
//  Increease the stock 
//  REtrun the rental 