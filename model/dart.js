module.exports = class Dart {
    constructor(name, value, multiplier){
        this.name = name;
        this.value = value;
        this.multiplier = multiplier;
    }

    getName(){
        return this.name;
    }

    getValue(){
        return this.value;
    }

    getMultiplier(){
        return this.multiplier;
    }
    
    getScore(){
        return this.getValue() * this.getMultiplier();
    }

}