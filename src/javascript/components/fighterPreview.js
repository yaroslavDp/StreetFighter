import createElement from '../helpers/domHelper';

export function createFighterPreview(fighter, position) {
    const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
    const fighterElement = createElement({
        tagName: 'div',
        className: `fighter-preview___root ${positionClassName}`
    });

    function createProperty(keyValue) {
        let icon = '';
        const nameElement = createElement({ tagName: 'span', className: 'fighter-preview___property' });
        switch (keyValue[0]) {
            case 'health':
                icon = '❤️';
                break;
            case 'attack':
                icon = '⚔️';
                break;
            case 'defense':
                icon = '🛡️';
                break;
            default:
                break;
        }
        nameElement.innerText = keyValue.join(': ').replace(/(\w+):/, icon);

        return nameElement;
    }

    function createPreviewImage(source) {
        const attributes = { src: source };
        const imgElement = createElement({
            tagName: 'img',
            className: 'fighter-image___preview',
            attributes
        });

        if (position === 'right') {
            imgElement.style.transform = 'scale(-1, 1)';
        }

        return imgElement;
    }

    if (fighter) {
        fighterElement.append(createPreviewImage(fighter.source));
        const fightPropsContainer = createElement({ tagName: 'div', className: 'fighter-preview___property-box' });
        Object.entries(fighter)
            .filter(keyValueAll => keyValueAll[0] !== '_id' && keyValueAll[0] !== 'source')
            .forEach(keyValue => fightPropsContainer.append(createProperty(keyValue)));
        fighterElement.append(fightPropsContainer);
    }

    return fighterElement;
}

export function createFighterImage(fighter) {
    const { source, name } = fighter;
    const attributes = {
        src: source,
        title: name,
        alt: name
    };
    const imgElement = createElement({
        tagName: 'img',
        className: 'fighter-preview___img',
        attributes
    });

    return imgElement;
}
