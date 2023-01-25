import { print } from './utils/print.js'

const main = () => {

    let result = 0;
    let firstOperand = 0;
    let operation;

    return (state) => {
        
        result = result + state;

        if (result.charAt(0) == '0' || result.charAt(0) == '=') {
            result = result.slice(1);
        }

        if (state == '.' && result.includes('.')) {
            return
        } 

        if(result.includes('АС')) {
            result = 0; 
        } else if (result.includes('С')) {
            result = result.slice(0, -2);
            if(!result.length) {
                result = 0;
            }
        }

        print(parseFloat(result))

        if (state == '+' || state == '-' || state == '/' || state == 'x') { 
            operation = state;
            firstOperand = result;
            result = 0;
            print(state)
        } else if (state == '=') {
            if (operation == '+') {
                result = parseFloat(firstOperand) + parseFloat(result);
                print(result)
            } else if (operation == '-') {
                result = parseFloat(firstOperand) - parseFloat(result);
                print(result)
            } else if (operation == '/') {
                result = parseFloat(firstOperand) / parseFloat(result);
                print(result)
            } else if (operation == 'x') {
                result = parseFloat(firstOperand) * parseFloat(result);
                print(result)
            }
        }
        
    }

}

export default main
