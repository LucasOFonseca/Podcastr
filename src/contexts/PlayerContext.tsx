import { createContext, useState, ReactNode, useContext } from 'react'

type Episode = {
    title: string,
    members: string,
    thumbnail: string,
    duration: number,
    url: string
}

type PlayerContextData = {
    episodeList: Episode[],
    currentEpisodeIndex: number,
    isPlaying: boolean,
    isLooping: boolean,
    isShuffling: boolean,
    isDark: boolean,
    hasNext: boolean,
    hasPrevious: boolean,
    play: (episode: Episode) => void,
    togglePlay: () => void,
    toggleLoop: () => void,
    toggleShuffle: () => void,
    toggleTheme: () => void,
    setPlayingState: (state: boolean) => void,
    playList: (list: Episode[], index: number) => void,
    playNext: () => void,
    playPrevious: () => void,
    clearPlayerState: () => void
}

type PlayerContextProviderProps = {
    children: ReactNode // Permite que o componete receba qualquer conteúdo react e html
}

export const PlayerContext = createContext({} as PlayerContextData)

// Exporta todas as funções de contexto
export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
    const [episodeList, setEpisodeList] = useState([])
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isLooping, setIsLooping] = useState(false)
    const [isShuffling, setIsShuffling] = useState(false)
    const [isDark, setIsDark] = useState(false)
    
    // função que incrementa a variável episodeList e seta o currentEpisodeIndex para 0
    function play(episode: Episode) {
        setEpisodeList([episode])
        setCurrentEpisodeIndex(0)
        setIsPlaying(true)
    }

    // Função responsável por alterar o botão entre play e pause
    function togglePlay() {
        setIsPlaying(!isPlaying)
    }

    // Função responsável por ativar e desativar a função de loop
    function toggleLoop() {
        setIsLooping(!isLooping)
    }

    // Função responsável por ativar e desativar o modo aleatório
    function toggleShuffle() {
        setIsShuffling(!isShuffling)
    }

    // Função responsável por alterar entre o tema claro e escuro
    function toggleTheme() {
        setIsDark(!isDark)


    }

    // Faz com que o estado do botão de reprodução mude ouvindo o controle de mídea do teclado
    function setPlayingState(state: boolean) {
        setIsPlaying(state)
    }

    // Reproduz uma lista de episódios
    function playList(list: Episode[], index: number) {
        setEpisodeList(list) // Define a lista que vai tocar
        setCurrentEpisodeIndex(index) // Define o índice do episódio em reprodução
        setIsPlaying(true)
    }

    // Constantes que armazenam os valores de anterior e próximo episódio
    const hasPrevious = currentEpisodeIndex > 0
    const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length

    // Reproduz o episódio seguinte
    function playNext() {
        if (isShuffling) {
            const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length) // Seleciona um índice de episódio aleatório para reproduzir

            setCurrentEpisodeIndex(nextRandomEpisodeIndex)
        } else if (hasNext) {
            setCurrentEpisodeIndex(currentEpisodeIndex + 1)
        }
    }

    // Reproduz o episódio anterior
    function playPrevious() {
        if (hasPrevious) {
            setCurrentEpisodeIndex(currentEpisodeIndex - 1)
        }
    }

    // É executada caso não haja mais episódios para reproduzir: volta o player para o estado inicial
    function clearPlayerState() {
        setEpisodeList([])
        setCurrentEpisodeIndex(0)
    }
    
    return (
        <PlayerContext.Provider value={{
        episodeList, 
        currentEpisodeIndex, 
        play, 
        isPlaying,
        isLooping,
        isShuffling,
        isDark, 
        togglePlay,
        toggleLoop, 
        toggleShuffle,
        toggleTheme,
        setPlayingState, 
        playList,
        playNext,
        playPrevious,
        hasNext,
        hasPrevious,
        clearPlayerState
        }}>
            {children}
        </PlayerContext.Provider>
    )
}

// Exporta o useContext com o PlayerContext
export const usePlayer = () => {
    return useContext(PlayerContext)
}