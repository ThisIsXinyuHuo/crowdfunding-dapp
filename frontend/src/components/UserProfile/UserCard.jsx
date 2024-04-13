const UserCard = ({ user }) => {

    return (
        <div className="flex justify-center items-center">
            <div id="user" className="flex flex-col justify-center rounded-xl sm:p-20 p-4 bg-gray-100 w-fit">
                <div className="flex flex-col p-4">
                    <div>
                        <h3 className='font-bold text-lg'>Address: {user.address}</h3>
                        <p className="mt-1 text-gray-400 text-left text-base leading-tight truncate">
                        </p>
                        <h3 className='font-bold text-lg'>Balance: {user.balance && `${user.balance} ETH`} </h3>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default UserCard;