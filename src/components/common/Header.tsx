import { memo } from 'react'

const themes = ['light', 'dark']

const changeTheme = (theme: string = 'light') => {
  const html = document.querySelector('html')
  const currentTheme = html?.getAttribute('data-theme')
  if (currentTheme === theme) return
  html?.setAttribute('data-theme', theme)
}

type Props = {
  isConnected: boolean
  onConnectBtnClick: () => void
}

const Header = memo(({ isConnected, onConnectBtnClick }: Props) => (
  <header className="w-full sm:max-w-xl pt-2 sm:pt-5 mb-5 sm:mb-10 px-2 mx-auto sticky top-0 z-50">
    <div className="flex navbar rounded-full gradient-bg glass shadow-lg sm:shadow-2xl">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl rounded-full text-primary inline-flex gap-0">
          <span>Serial Fan</span><span className="text-base-content hidden min-[420px]:block">&nbsp;Controller</span>
        </a>
      </div>
      <div className="flex-none">
        <button className="btn btn-ghost rounded-full gap-1 transition-all" onClick={onConnectBtnClick}>
          {isConnected ? 'DISCONNECT' : (<><span className="loading loading-ring text-primary"></span>CONNECT</>)}
        </button>
        <div className="dropdown dropdown-end dropdown-hover hidden min-[300px]:block">
          <label tabIndex={0} className="rounded-full btn btn-square btn-ghost">
            <svg className="inline-block h-4 w-4 stroke-current md:h-5 md:w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path></svg>
          </label>
          <ul tabIndex={0} className="p-2 shadow-md menu menu-compact dropdown-content bg-base-100 rounded-box w-52 overflow-y-auto max-h-[80vh] block">
            {themes.map(theme => (
              <li key={theme} onClick={() => changeTheme(theme)}>
                <a className='capitalize'>{theme}</a>
              </li>)
            )}
          </ul>
        </div>
      </div>
    </div>
  </header>
))

export default Header