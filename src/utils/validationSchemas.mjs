
export const createUserSchema = {
    userName:{
        exists: true,
        isString: true,
        notEmpty: true
    },
    displayName:{
        exists: true,
        isString: true,
        notEmpty: true
    },
    filter: {
        isString: true,
        notEmpty: true,
        optional: true
    },
    value:{
        isString: true,
        notEmpty: true,
        optional: true,
        isLength:{
            options:{
                min: 1,
                max: 13
            }
        }
    }
    
}