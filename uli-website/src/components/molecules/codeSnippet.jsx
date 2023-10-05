import React from "react";
import { CodeBlock, CopyBlock } from "react-code-blocks";

const CustomCodeBlock = (props) => {
    const { className, copy, children } = props;
    const language = className && className.match(/(?<=language-)(\w.*?)\b/)
        ? className.match(/(?<=language-)(\w.*?)\b/)[0]
        : "javascript";

    const trimmedCode = children.trim()

    const myCustomTheme = {
        lineNumberColor: "#6272a4",
        lineNumberBgColor: "#FFEBCB",
        backgroundColor: "#FFEBCB",
        textColor: "#514E80",
        substringColor: "#514E80",
        keywordColor: "#ff79c6",
        attributeColor: "#50fa7b",
        selectorAttributeColor: "#ff79c6",
        docTagColor: "#6272a4",
        nameColor: "#8be9fd",
        builtInColor: "#50fa7b",
        literalColor: "#f1fa8c",
        bulletColor: "#f1fa8c",
        codeColor: "#8be9fd",
        additionColor: "#f1fa8c",
        regexpColor: "#f1fa8c",
        symbolColor: "#f1fa8c",
        variableColor: "#f1fa8c",
        templateVariableColor: "#f1fa8c",
        linkColor: "#514E80",
        selectorClassColor: "#8be9fd",
        typeColor: "#8be9fd",
        stringColor: "#514E80",
        selectorIdColor: "#8be9fd",
        quoteColor: "#6272a4",
        templateTagColor: "#6272a4",
        deletionColor: "#ff5555",
        titleColor: "#ff79c6",
        sectionColor: "#ff79c6",
        commentColor: "#6272a4",
        metaKeywordColor: "#6272a4",
        metaColor: "#6272a4",
        functionColor: "#6272a4",
        numberColor: "#bd93f9",
    }
    return copy ? (
        <CopyBlock
            text={trimmedCode}
            language={language}
            theme={myCustomTheme}
            wrapLines
            codeBlock
        />
    ) : (
        <CodeBlock text={trimmedCode} language={language} theme={myCustomTheme} wrapLines />
    );
};

export default CustomCodeBlock