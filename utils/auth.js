import bcrypt from "bcrypt";

export const hashPassword = (password) => {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(12, (err, salt) => {
            if(err){
                reject(err);
            }
            bcrypt.hash(password, salt, (err, hashedPassword) => {
                if(err){
                    reject(err);
                }
                resolve(hashedPassword);
            });
        });
    });
}

export const comparePassword = (password, hashPassword) => {
    return bcrypt.compare(password, hashPassword);
}


