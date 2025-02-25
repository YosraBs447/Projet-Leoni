



import express from 'express';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';

mongoose
  .connect(
   "mongodb+srv://eyaaaboughzelaa27:EyaMongo12@myfirstnodejscluster0.nvdqw.mongodb.net/?retryWrites=true&w=majority&appName=MyFirstNodeJsCluster0")  
  .then(() => {
    console.log("connected to data base successfully");
  })
  .catch((error) => {
    console.log("error with conncting with data base", error);
  });

  // User Schema and Model
const userSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    matricule: { 
        type: Number, 
        required: true, 
        unique: true,
        validate: {
            validator: function(v) {
                return /^[0-9]{5}$/.test(v); // Vérifie que matricule est composé exactement de 5 chiffres
            },
            message:  'Le matricule doit comporter exactement 5 chiffres.'// message d'erreur
        }
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    
    role:{
        type:String,
        enum:["admin","technicien"],
        default:"technicien"// default role is technicien
    }
});

const User = mongoose.model("User", userSchema);


const app=express();// create express app
app.use(cors({
    origin:"http://localhost:5173"// allow requests from this url
}));// middleware to allow cors origin requests
const port=3000;// port to listen on

const users=[];// create a users array ya3ni a list of users


app.use(express.json());// middleware to parse json data ya3ni to convert json data to js object


app.post('/register', async (req, res) => {
    try {
        const { nom,prenom,matricule,email, password } = req.body;

        // Vérifier si l'utilisateur existe déjà dans la base de données
        const findUser = await User.findOne({ email: email });
        if (findUser) {
            return res.status(400).send({ message: 'Cet email est déjà utilisé !' });
        }

        // Vérifier si le matricule existe déjà dans la base de données
        const findMatricule = await User.findOne({ matricule: matricule });
        if (findMatricule) {
            return res.status(400).send({ message: 'Cette matricule est déjà utilisée !' });
        }


        // Hash du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Compter le nombre total d'utilisateurs
        const userCount = await User.countDocuments();

        // Si c'est le premier utilisateur, il sera admin, sinon technicien
        const role = userCount === 0 ? 'admin' : 'technicien';


        // Enregistrer le nouvel utilisateur dans la collection "utilisateurs"
        const newUser = new User({nom,prenom,matricule, email, password: hashedPassword ,role});
        await newUser.save();// save the new user in the data base

        console.log("Utilisateur créé avec succès !");
        res.sendStatus(201);
        
    } catch (err) {
        // Vérifier si l'erreur est une erreur de validation Mongoose
        if (err.name === 'ValidationError') {
            // Récupérer le premier message d'erreur de validation trouvé
            const firstErrorMessage = Object.values(err.errors)[0].message;
            return res.status(400).send({ message: firstErrorMessage });
        }

        // Pour les autres erreurs
        res.status(500).send({ message: err.message });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Vérifier si l'utilisateur existe dans la base de données
        const findUser = await User.findOne({ email: email });
        if (!findUser) {
            return res.status(400).send({ message: 'Email ou mot de passe incorrect !' });
        }

        // Comparer le mot de passe avec le hash enregistré
        const isMatch = await bcrypt.compare(password, findUser.password);
        if (isMatch) {
            console.log("Connexion réussie !");
            res.sendStatus(200);
        } else {
            res.status(400).send({ message: 'Email ou mot de passe incorrect !' });
        }
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});


app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
});// listen on port 3000