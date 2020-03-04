import React from "react";
import {useStores} from "../store";
import {View, Text} from "@nodegui/react-nodegui";
import {observer} from "mobx-react-lite";
import {Proposal} from "./proposal";

const {flag, name} = require('country-emoji');

export const Proposals = observer(() => {
    const {proposals} = useStores()
    const byCountry = proposals.byCountry;
    return (
        <View id="container" styleSheet={styleSheet}>
            {Object.keys(byCountry).sort().map(country => (
                <View id="country-container" key={country}>
                    <View id="country">
                        <Text id="country-flag">{flag(country)}</Text>
                        <Text id="country-name">{name(country)}</Text>
                    </View>
                    <View id="country-proposals">
                        {byCountry[country].map(p => {
                            return (
                                <Proposal key={`${p.providerId}${p.serviceType}`} {...p}/>
                            )
                        })}
                    </View>
                </View>
            ))}
        </View>
    )
})


const styleSheet = `
#container {
    font-size: 12px;
    background: #6f7c7d;

    flex-direction: column;
    padding: 0;
    padding-top: 0;
    padding-bottom: 27;
}
#country-container {
    flex-direction: column;
}
#country {
    background: #7f8c8d;
    padding: 5;
    height: 40px;
    border-bottom: 1px solid #666;
    border-top: 1px solid #656565;
}
#country-flag {
    font-size: 26px;
    padding-right: 1px;
}
#country-name {
    color: #eee;
    font-size: 13px;
}
#country-proposals {
    flex-direction: column;
}
`