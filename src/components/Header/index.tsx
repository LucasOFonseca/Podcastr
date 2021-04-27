import format from 'date-fns/format'
import ptBR from 'date-fns/locale/pt-BR'
import { usePlayer } from '../../contexts/PlayerContext'

import styles from './styles.module.scss'

export function Header() {
    const currentDate = format(new Date(), 'EEEEEE, d MMMM', {
        locale: ptBR
    })

    const { isDark, toggleTheme } = usePlayer()

    return (
        <header className={!isDark ? styles.headerContainer : styles.dark}>
            <img src={!isDark ? "/logo.svg" : "/logo-gray.svg"} alt="Podcastr"/>

            <p>O melhor para você ouvir, smepre</p>

            <span>{currentDate}</span>

            <button type="button" onClick={toggleTheme}>
                {!isDark ? <img src="/moon.svg" alt="Lua"/>
                : <img src="/sun.svg" alt="Sol"/>}
            </button>
        </header>
    )
}