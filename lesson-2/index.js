const readline = require('readline');
const c = require('ansi-colors');

class CustomReadline {
    constructor(options) {
        this.rl = readline.createInterface(options);
        this.handlersMap = {};
    }

    async writeGradually(str, delay) {
        this.pauseListening();
        await str.split('').reduce((acc, letter) => {
            return acc.then(() => {
                return new Promise(res => {
                    setTimeout(() => {
                        this.rl.write(c.greenBright(letter))
                        res();
                    }, delay)
                });
            });
        }, Promise.resolve());

        this.rl.write('\n');
        this.resumeListening();            
    }

    pauseListening() {
        const subscribedEvents = Object.keys(this.handlersMap);
        subscribedEvents.forEach(event => {
            this.rl.off(event, this.handlersMap[event]);
        });
    }

    resumeListening() {
        const subscribedEvents = Object.keys(this.handlersMap);
        subscribedEvents.forEach(event => {
            this.rl.on(event, this.handlersMap[event]);
        });
    }

    on(event, cb) {
        this.handlersMap[event] = cb;
        this.rl.on(event, cb);
    }

    close() {
        this.rl.close();
    }
}

function tossCoin() {
    return Math.random() > 0.5 ? 'орел' : 'решка';
}

rl = new CustomReadline({
    input: process.stdin,
    output: process.stdout,
});

rl.on('line', (answer) => {
    const side = tossCoin();
    let result = 'Не повезло, получится в другой раз!'
    if (answer === side) {
        result = 'Поздравляю! ты угадал!';
    }

    rl.writeGradually(result, 50).then(() => {
        rl.close();
    });
})

rl.writeGradually('Попробуешь угадать какой стороной упадет монета, орел или решка?', 50)


