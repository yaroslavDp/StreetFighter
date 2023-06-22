/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-expressions */
import controls from '../../constants/controls';
import createElement from '../helpers/domHelper';

export function getHitPower(fighter) {
    const criticalHitChance = fighter.critInput.length === 3 ? 2 : Math.random() + 1;
    return fighter.attack * criticalHitChance;
}

export function getBlockPower(fighter) {
    const dodjeChance = Math.random() + 1;
    return fighter.defense * dodjeChance;
}

export function getDamage(attacker, defender) {
    const damage = getHitPower(attacker) - getBlockPower(defender);
    return damage > 0 ? damage : 0;
}

export async function fight(firstFighter, secondFighter) {
    return new Promise(resolve => {
        const healthBarsContainer = document.querySelectorAll('.arena___health-bar');
        const healthBars = [...healthBarsContainer];
        const statusInfo = {
            block: false,
            currentHealth: 100,
            timeOfCrit: Date.now(),
            critInput: []
        };

        const playerOne = {
            ...firstFighter,
            ...statusInfo,
            healthBar: healthBars[0],
            position: 'left'
        };

        const playerTwo = {
            ...secondFighter,
            ...statusInfo,
            healthBar: healthBars[1],
            position: 'right'
        };

        function showStatus(fighter, text) {
            if (document.getElementById(`${fighter.position}-status-fighter`)) {
                document.getElementById(`${fighter.position}-status-fighter`).remove();
            }

            const fighterStatus = createElement({
                tagName: 'div',
                className: 'arena___status-fighter',
                attributes: { id: `${fighter.position}-status-fighter` }
            });
            fighterStatus.innerText = text;
            fighterStatus.style.opacity = '1';

            fighter.healthBar.appendChild(fighterStatus);

            setInterval(() => {
                if (fighterStatus.style.opacity > 0) {
                    fighterStatus.style.opacity -= 0.01;
                } else {
                    fighterStatus.remove();
                }
            }, 20);
        }

        function doAttack(attacker, defender) {
            if (defender.block) {
                showStatus(defender, 'Blocked!');
                return;
            }
            const totalDamage = getDamage(attacker, defender);

            if (!totalDamage) {
                showStatus(attacker, 'Missed!');
                return;
            }

            if (attacker.critInput.length === 3) {
                showStatus(attacker, 'Critical hit!');
            }

            showStatus(defender, `-${totalDamage.toFixed(1)}HP`);
            defender.currentHealth -= (totalDamage / defender.health) * 100;
            if (defender.currentHealth <= 0) {
                document.removeEventListener('keydown', onKeyDown);
                document.removeEventListener('keyup', onKeyUp);
                resolve(attacker);
            }

            defender.healthBar.style.width = `${defender.currentHealth}%`;
        }

        function critAttackHandler(event, fighter) {
            const currentTime = Date.now();

            if (currentTime - fighter.timeOfCrit < 10000) {
                return false;
            }

            if (!fighter.critInput.includes(event.code)) {
                fighter.critInput.push(event.code);
            }

            if (fighter.critInput.length === 3) {
                fighter.timeOfCrit = currentTime;
                return true;
            }
            return false;
        }

        function onKeyDown(event) {
            if (!event.repeat) {
                switch (event.code) {
                    case controls.PlayerOneAttack:
                        playerOne.block ? null : doAttack(playerOne, playerTwo);
                        break;

                    case controls.PlayerTwoAttack:
                        playerTwo.block ? null : doAttack(playerTwo, playerOne);
                        break;

                    case controls.PlayerOneBlock:
                        playerOne.block = true;
                        break;

                    case controls.PlayerTwoBlock:
                        playerTwo.block = true;
                        break;
                    default:
                        break;
                }
                if (controls.PlayerOneCriticalHitCombination.includes(event.code)) {
                    critAttackHandler(event, playerOne) ? doAttack(playerOne, playerTwo) : null;
                }

                if (controls.PlayerTwoCriticalHitCombination.includes(event.code)) {
                    critAttackHandler(event, playerTwo) ? doAttack(playerTwo, playerOne) : null;
                }
            }
        }

        function onKeyUp(event) {
            switch (event.code) {
                case controls.PlayerOneBlock:
                    playerOne.block = false;
                    break;
                case controls.PlayerTwoBlock:
                    playerTwo.block = false;
                    break;
                default:
                    break;
            }

            if (playerOne.critInput.includes(event.code)) {
                playerOne.critInput.splice(playerOne.critInput.indexOf(event.code), 1);
            }

            if (playerTwo.critInput.includes(event.code)) {
                playerTwo.critInput.splice(playerTwo.critInput.indexOf(event.code), 1);
            }
        }

        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup', onKeyUp);
    });
}
