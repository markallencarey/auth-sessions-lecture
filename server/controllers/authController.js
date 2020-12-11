//This register function is pretty much going to identical every time

const bcrypt = require('bcryptjs')

module.exports = {
  register: async (req, res) => {
    const db = req.app.get('db')
    
    //TODO Receiver the needed info (name, email, password, admin) from req.body
    //- this came from our Postgres table we set up - those are the columns
   const { name, email, password, admin } = req.body
   
    //TODO Check if they are already registered - if they are, reject the request
    //await says wait for db.get_user_by_email (the asynchronous action) to finish
    //await is an alternative syntax to using .then
    //in order for await to work, you have to mark the function as async
   const [existingUser] = await db.get_user_by_email([email])
    //the square brackets is basically destructuring for arrays
    //get_user_by_email returns an array (all massive promises return arrays)
    //it assigns index 0 of the array to existing User
   
   if (existingUser) {
     return res.status(409).send('User already exists')
    }
    
    //TODO Hash and salt the password
    const salt = bcrypt.genSaltSync(10)
    
    const hash = bcrypt.hashSync(password, salt)
    
    //TODO Insert them into the db
    const [newUser] = await db.register_user([name, email, hash, admin])
    
    //TODO Attach that user to the session
    req.session.user = newUser

    //TODO Send confirmation of registration
    res.status(200).send(newUser)
  },
  login: async (req, res) => {
    const db = req.app.get('db')

    //TODO Get necessary info off of req.body (email, password)
    const { email, password } = req.body

    //TODO Check if user exists - if they do NOT, reject the request
    const [existingUser] = await db.get_user_by_email([email])

    if (!existingUser) {
      return res.status(404).send('User does not exist')
    }

    //TODO Check their password against the hash - if there is a mismatch, reject the request
    const isAuthenticated = bcrypt.compareSync(password, existingUser.hash)

    if (!isAuthenticated) {
      return res.status(401).send('Incorrect password')
    }

    //TODO Delete the hash from the user object
    delete existingUser.hash


    //TODO Attach the user to the session
    req.session.user = existingUser

    //TODO Send back confirmation of login
    res.status(200).send(existingUser)


   },
  getUserSession: (req, res) => {
    if (req.session.user) {
      res.status(200).send(req.session.user)
    } else {
      res.status(404).send('No session found')
    }
  },
  logout: (req, res) => {
    req.session.destroy()
    res.sendSession(200)
  }
}