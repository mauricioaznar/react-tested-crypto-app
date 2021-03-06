import {fireEvent, screen, waitFor, waitForElementToBeRemoved} from "@testing-library/react";
import React from "react";
import CryptoComparator from "./CryptoComparator";
import {render} from "../../test-utils/render";
import {RootState} from "../../redux/reducers";
import {coinGeckoException, server} from "../../test-utils/server";

const defaultStoreState: RootState = {
    auth: {
        currentUser: {
            firstName: "maria",
            lastName: "perez",
            email: "email@gmail.com",
            telephone: "23232323232"
        }
    }
}


describe('Crypto comparator', function () {
    it('renders title', async () => {
        render(<CryptoComparator/>, {initialState: defaultStoreState})
        await waitForElementToBeRemoved(() => screen.queryByText(/Loading/i))
        const title = await screen.findByText(/Crypto comparator/i);
        expect(title).toBeInTheDocument();
    })

    it('renders navbar with user first-name', async () => {
        render(<CryptoComparator/>, {initialState: defaultStoreState})
        await waitForElementToBeRemoved(() => screen.queryByText(/Loading/i))
        const firstNameElement = await screen.findByText(/maria perez/i)
        expect(firstNameElement).toBeInTheDocument()
    })

    it('renders 2 list items rates (crypto compare rate & coin gecko rate) after loading', async () => {
        render(<CryptoComparator/>, {initialState: defaultStoreState})
        await waitForElementToBeRemoved(() => screen.queryByText(/Loading/i))
        const listitems = await screen.findAllByRole('listitem')
        expect(listitems).toHaveLength(2)
    })

    it('renders 4 list items rates after 15 seconds', async () => {
        render(<CryptoComparator/>, {initialState: defaultStoreState})
        await waitForElementToBeRemoved(() => screen.queryByText(/Loading/i))
        await waitFor(async () => {
            const listitems = await screen.findAllByRole('listitem')
            expect(listitems).toHaveLength(4)
        }, { timeout: 17000 })
    })

    it('renders coin exchange buttons (eth, btc, xrp)', async () => {
        render(<CryptoComparator/>, {initialState: defaultStoreState})
        await waitForElementToBeRemoved(() => screen.queryByText(/Loading/i))
        const links = await screen.findAllByRole('button')
        expect(links).toHaveLength(3)
    })

    it('changes currency information when link is clicked', async () => {
        render(<CryptoComparator/>, {initialState: defaultStoreState})
        await waitForElementToBeRemoved(() => screen.queryByText(/Loading/i))
        const ethLink = await screen.findAllByRole('button') as HTMLLinkElement[]
        fireEvent.click(ethLink[1])
        const textValue = ethLink[1].innerHTML
        const ethElements = await screen.findAllByText(textValue.toLocaleUpperCase())
        expect(ethElements.length).toBeGreaterThan(1)
    })

    it('displays error message when something has failed', async () => {
        server.use(coinGeckoException)
        render(<CryptoComparator/>, {initialState: defaultStoreState})
        await waitForElementToBeRemoved(() => screen.queryByText(/Loading/i))
        const errorElement = await screen.findByText(/Something went wrong/i)
        expect(errorElement).toBeInTheDocument()
    })



});