import React from "react";

export const App = () => {
    const [cheesecakes, setCheesecakes] = React.useState(0);

    return(
        <div>
            <h1>Inventory Contents</h1>
            <p>Cheesecakes: {cheesecakes}</p>
            <button onClick={() => setCheesecakes(cheesecakes + 1)}>
                Add Cheesecake
            </button>
        </div>
    )
}