const Slogan = ({text1, text2}) => {
    return (
        <div className="text-center bg-white text-gray-800 pt-40 px-6">
      <h1
        className="text-5xl md:text-6xl xl:text-7xl font-bold
      tracking-tight mb-12"
      >

        <span > {text1} </span>
        <br />
        
        <span>{text2}</span>
      </h1>
      </div>
    )
}

export default Slogan