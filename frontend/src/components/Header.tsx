

const Header = ({ showReset, toggleView }: { showReset: boolean, toggleView: () => void }) => {
  return (
    <div className="font-bold container mx-auto mb-5 md:text-left py-4">
      <div className="flex"><div className="grow text-3xl items-center"><h1>Drip AI</h1></div>
        {showReset ? <div>
          <button
            className="flex flex-row bg-gray-200 rounded-full p-2 px-4 hover:scale-105 transition-transform duration-300 active-bg-gray-300"
            onClick={toggleView}
            >
            <img
              src="/plus.svg"
              alt="Start Over">
            </img>
            <span>New</span>
          </button>
        </div> : null}
      </div>
    </div>


  )
}

export default Header;