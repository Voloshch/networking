import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { base16AteliersulphurpoolLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Header, Icon, Popup } from 'semantic-ui-react';

const CodeSnippet = ({ content, copyFuncion }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = () => {
        setIsOpen(true);
        setTimeout(() => {
            setIsOpen(false);
        }, 2000);
    };

    const handleClose = () => {
        setIsOpen(false);
        clearTimeout();
    };

    const copyButton = (
        <button onClick={() => copyFuncion(content)}>
            <Icon name='copy' />
        </button>
    );

    const style = {
        fontWeight: 'bold'
    };

    return (
        <>
            <div className='header-container'>
                <Header as='h5' color='grey' style={{ margin: 0 }}>Terminal</Header>
                <Popup
                    trigger={copyButton}
                    content='Copied to clipboard'
                    inverted
                    style={style}
                    position='top center'
                    on='click'
                    open={isOpen}
                    onOpen={handleOpen}
                    onClose={handleClose}
                />
            </div>
            <div className='code-snippet-wrapper'>
                <SyntaxHighlighter
                    wrapLongLines
                    wrapLines
                    language='bash'
                    style={base16AteliersulphurpoolLight}
                >
                    {content}
                </SyntaxHighlighter>
            </div>
        </>
    );
};

CodeSnippet.propTypes = {
    content: PropTypes.any,
    copyFuncion: PropTypes.func
};

export default CodeSnippet;
