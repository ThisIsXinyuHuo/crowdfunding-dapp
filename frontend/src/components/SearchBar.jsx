import ButtonVariant from './ButtonVariant'

const SearchBar = () => {
    return (
        <div className="lg:flex-1 flex flex-row max-w-[600px] border-2 py-2 pl-4 pr-2 h-[52px] bg-white rounded-full">
            <input type="text" placeholder="Search for campaigns" className="flex w-full  text-[14px] placeholder:text-[#4b5264]  outline-none" />
            <ButtonVariant 
            type = "button"
            text = "Search"
            style = "w-[72px] h-full flex justify-center items-center cursor-pointer"
        />
        
        </div>
    )
    
}

export default SearchBar;