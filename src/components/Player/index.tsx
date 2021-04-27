import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { usePlayer } from '../../contexts/PlayerContext'
import Slider from 'rc-slider'

import 'rc-slider/assets/index.css'
import styles from './styles.module.scss'
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString'

export function Player() {
    // Referência da tag audio para acessa-la através do next
    const audioRef = useRef<HTMLAudioElement>(null)

    const [progress, setProgress] = useState(0)

    const { 
        episodeList, 
        currentEpisodeIndex, 
        isPlaying, 
        togglePlay, 
        setPlayingState, 
        playNext, 
        playPrevious,
        hasNext,
        hasPrevious,
        isLooping,
        toggleLoop,
        toggleShuffle,
        isShuffling,
        clearPlayerState,
        isDark 
    } = usePlayer()

    // Função responsável por reproduzir e pausar o áudio
    useEffect(() => {
        if (!audioRef.current) {
            return
        }

        if (isPlaying) {
            audioRef.current.play()
        } else {
            audioRef.current.pause()
        }

    }, [isPlaying])

    // Retorna do elemento audio o tempo atual de reprodução
    function setupProgressListener() {
        audioRef.current.currentTime = 0

        audioRef.current.addEventListener('timeupdate', () => {
            setProgress(Math.floor(audioRef.current.currentTime))
        })
    }

    // Inicia outro episódio quando o atual termina
    function handleEpidsodeEnded() {
        if (hasNext) {
            playNext()
        } else {
            clearPlayerState()
        }
    }

    // Permite controlar o progresso da reprodução artavés do slider
    function handleSeek(amount: number) {
        audioRef.current.currentTime = amount

        setProgress(amount)

    }

    // Determina o episódio em reprodução
    const episode = episodeList[currentEpisodeIndex]

    return (
        <div className={!isDark ? styles.playerContainer : styles.playerDark}>
            <header>
                <img src="/playing.svg" alt="Tocando Agora"/>
                <strong>Tocando agora </strong>
            </header>

            { episode ? (
                <div className={styles.currentEpisode}>
                    <Image 
                        width={592}
                        height={592}
                        src={episode.thumbnail}
                        objectFit="cover"
                    />

                    <strong>{episode.title}</strong>
                    <span>{episode.members}</span>
                </div>
            ) : (
                <div className={!isDark ? styles.emptyPlayer : styles.darkEmptyPlayer}>
                    <strong>Selecione um podcast para ouvir</strong>
                </div>
            ) }


            <footer className={!episode ? styles.empty : ''}>
                <strong>{episode ? episode.title : ''}</strong>
                <span className={styles.members}>{episode ? episode.members : ''}</span>

                <div className={styles.progress}>
                    <span>{convertDurationToTimeString(progress)}</span>

                    <div className={styles.slider}>
                        { episode ? (
                            <Slider 
                                max={episode.duration}
                                value={progress}
                                onChange={handleSeek}
                                trackStyle={{ backgroundColor: '#04d361' }}
                                railStyle={{ backgroundColor: '#9f75ff' }}
                                handleStyle={{ borderColor: '#04d361', borderWidth: 4}}
                            />
                        ) : (
                            <div className={styles.emptySlider}/>
                        ) }
                    </div>

                    <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
                </div>

                { episode && (
                    <audio 
                        src={episode.url} 
                        ref={audioRef} 
                        onPlay={() => setPlayingState(true)} 
                        onPause={() => setPlayingState(false)} 
                        autoPlay
                        loop={isLooping}
                        onLoadedMetadata={setupProgressListener}
                        onEnded={handleEpidsodeEnded}
                    />
                )}

                <div className={styles.buttons}>
                    <button type="button" 
                        onClick={toggleShuffle} 
                        disabled={!episode || episodeList.length === 1} 
                        className={isShuffling ? styles.isActive : ''}>
                            <img src="/shuffle.svg" alt="Embaralhar"/>
                        </button>
                    <button type="button" onClick={playPrevious} disabled={!episode || !hasPrevious}><img src="/play-previous.svg" alt="Tocar Anterior"/></button>

                    <button type="button" disabled={!episode} className={styles.playButton} onClick={togglePlay}>
                        { isPlaying 
                            ? <img className={styles.pause} src="/pause.svg" alt="Pausar"/>
                            : <img src="/play.svg" alt="Tocar"/> }
                    </button>

                    <button type="button" onClick={playNext} disabled={!episode || !hasNext}><img src="/play-next.svg" alt="Tocar Próxima"/></button>
                    <button type="button" onClick={toggleLoop} disabled={!episode} className={isLooping ? styles.isActive : ''}><img src="/repeat.svg" alt="Repetir"/></button>
                </div>
            </footer>
        </div>
    )
}