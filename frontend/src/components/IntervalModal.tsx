import { useEffect, useState } from 'react';
import { ProducerInterval } from '../types';
import './modal.css';
import Modal from 'react-modal'

interface IntervalModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    longest: ProducerInterval | null;
    shortest: ProducerInterval | null;
}

Modal.setAppElement('#root');

export function IntervalModal({ isOpen, onRequestClose, longest, shortest }: IntervalModalProps) {
    const [longestInterval, setLongestInterval] = useState<ProducerInterval | null>(null);
    const [shortestInterval, setShortestInterval] = useState<ProducerInterval | null>(null);

    useEffect(() => {
        if (longest) {
            setLongestInterval(longest);
        }
        if (shortest) {
            setShortestInterval(shortest);
        }
    }, [longest, shortest]);

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className="modal-content"
            overlayClassName="modal-overlay"
            shouldCloseOnEsc={false}
            shouldFocusAfterRender={false}
        >
            <h2>Intervalos de Produtores</h2>
            {longestInterval && (
                <div>
                    <h3>Maior Intervalo</h3>
                    <p>Produtor: {longestInterval.producer}</p>
                    <p>Intervalo: {longestInterval.maxInterval} anos</p>
                </div>
            )}
            {shortestInterval && (
                <div>
                    <h3>Menor Intervalo</h3>
                    <p>Produtor: {shortestInterval.producer}</p>
                    <p>Intervalo: {shortestInterval.minInterval} anos</p>
                </div>
            )}
            <button onClick={onRequestClose}>Fechar</button>
        </Modal>
    );
}

export default IntervalModal;

