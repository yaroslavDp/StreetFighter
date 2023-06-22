import showModal from './modal';
import { createFighterImage } from '../fighterPreview';

export default function showWinnerModal(fighter) {
    const imageElement = createFighterImage(fighter);
    const winnerInfo = {
        title: `${fighter.name.toUpperCase()} won!!`,
        bodyElement: imageElement,
        onClose: () => {
            window.location.reload();
        }
    };

    showModal(winnerInfo);
}
