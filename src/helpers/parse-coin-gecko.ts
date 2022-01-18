import {Rates} from "../models/rates";

export function parseCoinGecko(coinGeckoResponse: { data: any }): Rates {
    const data = coinGeckoResponse.data



    let eth = data.find((d: any)=> d.id === 'ethereum')?.current_price | 0
    let btc = data.find((d: any)=> d.id === 'bitcoin')?.current_price | 0
    let xrp = data.find((d: any)=> d.id === 'ripple')?.current_price | 0

    return {
        eth: eth,
        btc: btc,
        xrp: xrp,
    }
}