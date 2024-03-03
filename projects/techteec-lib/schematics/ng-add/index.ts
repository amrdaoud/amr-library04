import { Rule, Tree, SchematicContext } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
export function ngAdd(): Rule {
    return (tree: Tree, context: SchematicContext) => {
        context.logger.info('We are installing techteec-lib for you');
        context.addTask(new NodePackageInstallTask());
        return tree;
    }
}