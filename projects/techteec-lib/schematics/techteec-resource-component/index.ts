import { Rule, apply, applyTemplates, chain, mergeWith, move, strings, url } from "@angular-devkit/schematics";
import { normalize } from "@angular-devkit/core";
import { TechteecResourceComponentSchema } from "./tecteech-resource-component";

export function techteecResourceComponent(option: TechteecResourceComponentSchema): Rule {
    return () => {
        const templateSource = apply(
            url('./files'),[
                applyTemplates({
                    capitalize: strings.capitalize,
                    classify: strings.classify,
                    camelize: strings.camelize,
                    dasherize: strings.dasherize,
                    name: option.name,
                    folderName: option.folderName || option.name,
                    apiUrlSuffix: option.apiUrlSuffix || option.name,
                    dataWithSizeData: option.dataWithSizeData,
                    dataWithSizeSize: option.dataWithSizeSize,
                    apiGetByFilterMethodSuffix: option.apiGetByFilterMethodSuffix ? ('/' + option.apiGetByFilterMethodSuffix) : '',
                    apiGetByIdMethodSuffix: option.apiGetByIdMethodSuffix ? ('/' + option.apiGetByIdMethodSuffix) : '',
                    apiAddMethodSuffix: option.apiAddMethodSuffix ? ('/' + option.apiAddMethodSuffix) : '',
                    apiEditMethodSuffix: option.apiEditMethodSuffix ? ('/' + option.apiEditMethodSuffix) : '',
                    apiDeleteMethodSuffix: option.apiDeleteMethodSuffix ? ('/' + option.apiDeleteMethodSuffix) : '',
                    apiDownloadByFilterMethodSuffix: option.apiDownloadByFilterMethodSuffix ? ('/' + option.apiDownloadByFilterMethodSuffix) : '/export'

                }),
                move(normalize(`/${option.path}/${strings.dasherize(option.folderName)}`))
            ]
        );
        return chain([
            mergeWith(templateSource)
        ])
    }
}