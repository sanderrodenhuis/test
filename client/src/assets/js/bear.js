/** Class representing a bear */
class Bear {
    /**
     * Create a bear
     * @param options
     */
    constructor(options = {}) {
        const name = options.name || 'John Doe';
        this.set('name', name);
        this.set('bearType', 'grizzly');
    }

    /**
     * Set the value for the key
     * @param key
     * @param val
     */
    set(key, val) {
        this[key] = val;
    }

    /**
     * Get the key value
     * @param key
     * @returns {*} the key value
     */
    get(key) {
        return this[key];
    }

    /**
     * Let the bear say hello
     * @returns {string}
     */
    sayHello() {
        return 'Hello, my name is ' + this.name + ' and I am a ' + this.bearType + ' bear.';
    }
}

export { Bear };