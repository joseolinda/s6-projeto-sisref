class HelpersClass {
    debounce(callbackFunction, timeToWait = 400) {
        let timer = null;
        return function() {
            clearTimeout(timer);
            timer = setTimeout(callbackFunction, timeToWait);
        };
    }
}

const Helpers = new HelpersClass();

export default Helpers;
export const { debounce } = Helpers;