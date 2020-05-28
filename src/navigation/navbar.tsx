/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import styled from "styled-components"

import { WalletButton } from "../payment/comp/wallet-button"

const Container = styled.div`
    box-sizing: border-box;
    height: 40px;
    padding: 8px 16px;
    background: linear-gradient(180deg, #d6d6d6 0%, #cccccc 97%, #bababa 100%);
    display: flex;
    justify-content: flex-end;

    div {
        cursor: pointer;
    }
`

export const NavBar: React.FC = () => {
    return (
        <Container>
            <div>
                <WalletButton />
            </div>
        </Container>
    )
}
