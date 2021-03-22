import match from 'minimatch';

export interface PackageJSON extends Record<string, unknown> {
  dependencies: Record<string, string>;
}

type DependenciesList = string[];

type IncludeExcludeList = (string | RegExp)[];

const isPassIncudeExclude = (value: string, include: IncludeExcludeList, exclude: IncludeExcludeList) => {
  const shouldBeExplicitlyIncluded = include.length > 0;
  let isIncluded = false;

  for (const inc of include) {
    if (typeof inc === 'string') {
      if (match(value, inc)) {
        isIncluded = true;
        break;
      }
    } else if (inc instanceof RegExp) {
      if (inc.test(value)) {
        isIncluded = true;
        break;
      }
    }
  }

  if (!isIncluded && shouldBeExplicitlyIncluded) {
    return false;
  }

  for (const ex of exclude) {
    if (typeof ex === 'string') {
      if (match(value, ex)) {
        return false;
      }
    } else if (ex instanceof RegExp) {
      if (ex.test(value)) {
        return false;
      }
    }
  }

  return true;
};

type GetEveryDependencyOptions = {
  maxDepth?: number;
  include?: IncludeExcludeList;
  exclude?: IncludeExcludeList;
  peer?: boolean;
  normal?: boolean;
  dev?: boolean;
  optional?: boolean;
};

/*
  Get every dependency and dependencies of dependencies
*/
export function getEveryDependency(
  pathToPackageJSON: string,
  {
    exclude = [],
    include = [],
    // get only direct dependencies by default
    maxDepth = 0,
    normal = true,
    dev = false,
    optional = false,
    peer = false,
  }: GetEveryDependencyOptions = {}
): DependenciesList {
  const getDeps = (pathToPackage: string, currDepth: number): DependenciesList => {
    const pkgJSON = require(pathToPackage);
    const deps = {
      ...(normal ? pkgJSON.dependencies ?? {} : {}),
      ...(dev ? pkgJSON.devDependencies ?? {} : {}),
      ...(peer ? pkgJSON.peerDependencies ?? {} : {}),
      ...(optional ? pkgJSON.optionalDependencies ?? {} : {}),
    };

    let depsList = Object.keys(deps);

    if (exclude.length || include.length) {
      depsList = depsList.filter((d) => isPassIncudeExclude(d, include, exclude));
    }

    let tail: DependenciesList[] = [];
    if (currDepth < maxDepth) {
      tail = depsList.map((d) => getDeps(d + '/package.json', currDepth + 1));
    }

    // filter out duplicates
    return Array.from(new Set([...depsList, ...tail].reduce((acc, val) => acc.concat(val as string), [])));
  };

  return getDeps(pathToPackageJSON, 0);
}

export function getScopedDependencies(
  pathToPackageJSON: string,
  scopes: string[],
  options: GetEveryDependencyOptions = {}
) {
  return getEveryDependency(pathToPackageJSON, {
    ...options,
    include: scopes.map((scope) => scope + '/**'),
  });
}
