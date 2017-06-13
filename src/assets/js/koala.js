import { Bear } from './bear';

/**
 * Class representing a koala
 * @extends Bear
 */
class Koala extends Bear {
    /**
     * Create a koala
     * @param args
     */
    constructor(...args) {
        super(...args);

        this.set('bearType', 'koala');
    }
}

export { Koala };