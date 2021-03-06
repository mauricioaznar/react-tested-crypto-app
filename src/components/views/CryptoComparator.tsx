import React, {useEffect, useState} from 'react'
import './CryptoComparator.css'
import {useTypedSelector} from "../../hooks/redux-hooks/useTypedSelector";
import axios from "axios";
import {parseCoinGecko} from "../../helpers/parse-coin-gecko";
import {BASE_COIN_GECKO_URL, BASE_CRYPTO_COMPARE_URL} from "../../helpers/constants";
import {parseCryptoCompare} from "../../helpers/parse-crypto-compare";
import CryptoRates from "./crypto-comparator/CryptoRates";
import {RatesWithDate} from "../../types/rates-with-date";
import CryptoConverter from "./crypto-comparator/CryptoConverter";
import {Rates} from "../../types/rates";
import CryptoTimer from "./crypto-comparator/CryptoTimer";
import useIsMountedRef from "../../hooks/dum/useIsMountedRef";

const COUNTDOWN = 15
const buttons: (keyof Rates)[] = ['eth', 'btc', 'xrp']

export default function CryptoComparator() {
    const {currentUser} = useTypedSelector((state) => state.auth);

    const [coinGeckoRates, setCoinGeckoRates] = useState<Array<RatesWithDate>>([])
    const [cryptoCompareRates, setCryptoCompareRates] = useState<Array<RatesWithDate>>([])

    const [selectedButton, setSelectedButton] = useState(buttons[0])

    const [isMountedRef, setIsMountedRef] = useIsMountedRef()
    const [isError, setIsError] = useState(false)
    const isLoading = coinGeckoRates.length === 0


    const getCryptoRates = () => {
        Promise.all([
            axios.get(`${BASE_CRYPTO_COMPARE_URL}?fsyms=BTC%2CETH%2CXRP&tsyms=MXN`),
            axios.get(`${BASE_COIN_GECKO_URL}?vs_currency=mxn&ids=bitcoin%2Cethereum%2Cripple`)
        ])
            .then(response => {
                if (isMountedRef.current) {
                    const [
                        cryptoCompareResponse,
                        coinGeckoResponse
                    ] = response

                    const cryptoCompareRate = parseCryptoCompare(cryptoCompareResponse)
                    setCryptoCompareRates([cryptoCompareRate, ...cryptoCompareRates])
                    const coinGeckoRate = parseCoinGecko(coinGeckoResponse)
                    setCoinGeckoRates([coinGeckoRate, ...coinGeckoRates])
                }
            })
            .catch(_ => {
                if (isMountedRef.current) {
                    setIsError(true)
                }
            })
    }

    useEffect(() => {
        getCryptoRates()
        setIsMountedRef(true)
        return () => {
            setIsMountedRef(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])



    return  isError
        ? <div className={'crypto-comparator_error m-5'}>Something went wrong!</div>
        : isLoading ? <div className={'crypto-comparator_loading m-5'}>Loading...</div>
        : <div className={'crypto-comparator'}>
            <nav className={'crypto-comparator_nav d-flex align-center justify-space-around'}>
                <div className={'d-flex column justify-center align-center'}>
                    <h2 className={'crypto-comparator_nav-title m-2'}>
                        Crypto comparator
                    </h2>
                    <div className={'mb-4'}>
                        {
                            buttons.map(btn => {
                                return (
                                    <button
                                        className={`crypto-comparator_nav-button button ml-2 ${btn === selectedButton ? 'button--active' : ''}`}
                                        key={btn}
                                        onClick={() => {
                                            setSelectedButton(btn)
                                        }}
                                    >
                                        { btn }
                                    </button>
                                )
                            })
                        }
                    </div>
                </div>
                <h4
                    className={'crypto-comparator_nav-user'}
                >
                    {`${currentUser?.firstName} ${currentUser?.lastName}`}
                </h4>

                <CryptoTimer callback={getCryptoRates} countdown={COUNTDOWN} />
            </nav>

            <div className={'d-flex m-5'}>

                <CryptoRates
                    rates={coinGeckoRates}
                    name={'Coin gecko'}
                    currentCrypto={selectedButton}
                />
                <CryptoRates
                    className={'ml-5'}
                    rates={cryptoCompareRates}
                    name={'Crypto compare'}
                    currentCrypto={selectedButton}
                />
            </div>
            <CryptoConverter

                exchangesUpdates={[
                    {
                        rate: coinGeckoRates[0]?.[selectedButton],
                        exchangeName: 'Coin gecko'
                    },
                    {
                        rate: cryptoCompareRates[0]?.[selectedButton],
                        exchangeName: 'Crypto compare'
                    }
                ]}

            />
        </div>

}