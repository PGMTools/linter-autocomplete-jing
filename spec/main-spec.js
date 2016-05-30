'use babel';

import linter from '../lib/main';
import serverProcess from '../lib/serverProcess';
import path from 'path';

const xmlPath = (filename) => path.resolve(__dirname, `xml/${filename}`);
const catalogPath = (filename) => path.resolve(__dirname, `catalog/${filename}`);

describe('main', () => {
  let exitServer;

  it('%%% pseudo before all %%%', () => {
    exitServer = serverProcess.exit.bind(serverProcess);
    serverProcess.exit = function() {};
  });

  const testValidation = (basename, cb) =>
    waitsForPromise(() =>
      atom.workspace.open(xmlPath(basename))
      .then((editor) =>
        linter.provideLinter().lint(editor)
        .then(cb)
        .then(() => {
          const pane = atom.workspace.paneForItem(editor);
          pane.destroyItem(editor);
        })
      )
    );

  describe('Schema Types', () => {
    beforeEach(() => {
      waitsForPromise(() =>
        atom.packages.activatePackage('linter-jing')
      );
      atom.config.set('linter-jing.xmlCatalog', catalogPath('catalog.xml'));
    });

    describe('given an empty file', () => {
      it('returns an array containing an error message', () => {
        testValidation('empty.xml', (messages) => {
          expect(Array.isArray(messages)).toBe(true);
          expect(messages.length).toEqual(1);
          expect(messages[0].type).toEqual('Error');
        });
      });
    });

    describe('given a not well-formed file', () => {
      it('returns an array containing an error message', () => {
        testValidation('notwellformed.xml', (messages) => {
          expect(Array.isArray(messages)).toBe(true);
          expect(messages.length).toEqual(1);
          expect(messages[0].type).toEqual('Error');
        });
      });
    });

    describe('given a well-formed xml document without schema references', () => {
      it('returns an empty array', () => {
        testValidation('wellformed.xml', (messages) => {
          expect(Array.isArray(messages)).toBe(true);
          expect(messages.length).toEqual(0);
        });
      });
    });

    describe('given a well-formed xml document with a schema references ' +
      'pointing to a missing file', () => {
      it('returns an array with a warning', () => {
        testValidation('wrong-schema-path.xml', (messages) => {
          expect(Array.isArray(messages)).toBe(true);
          expect(messages.length).toEqual(1);
          expect(messages[0].type).toEqual('Warning');
        });
      });
    });

    describe('given a well-formed xml document with an unknown schema type', () => {
      it('returns a warning', () => {
        testValidation('unknown-schematype.xml', (messages) => {
          expect(Array.isArray(messages)).toBe(true);
          expect(messages.length).toEqual(1);
          expect(messages[0].type).toEqual('Warning');
        });
      });
    });

    describe('given a well-formed xml document with a correct ' +
      'reference to a valid RNC schema', () => {
      describe('when the document is valid', () => {
        it('returns an empty array', () => {
          testValidation('rng-valid.xml', (messages) => {
            expect(Array.isArray(messages)).toBe(true);
            expect(messages.length).toEqual(0);
          });
        });
      });

      describe('when the document contains 5 validation errors', () => {
        it('returns an array of length 5', () => {
          testValidation('rng-invalid.xml', (messages) => {
            expect(Array.isArray(messages)).toBe(true);
            expect(messages.length).toEqual(5);
          });
        });
      });
    });

    describe('given a well-formed xml document with a correct ' +
      'reference to a valid RNC schema', () => {
      describe('when the document is valid', () => {
        it('returns an empty array', () => {
          testValidation('rnc-valid.xml', (messages) => {
            expect(Array.isArray(messages)).toBe(true);
            expect(messages.length).toEqual(0);
          });
        });
      });

      describe('when the document contains 5 validation errors', () => {
        it('returns an array of length 5', () => {
          testValidation('rnc-invalid.xml', (messages) => {
            expect(Array.isArray(messages)).toBe(true);
            expect(messages.length).toEqual(5);
          });
        });
      });
    });

    describe('given a well-formed xml document with a correct ' +
      'reference to a valid XSD schema', () => {
      describe('when the document is valid', () => {
        it('returns an empty array', () => {
          testValidation('xsd-valid.xml', (messages) => {
            expect(Array.isArray(messages)).toBe(true);
            expect(messages.length).toEqual(0);
          });
        });
      });

      describe('when the document contains 6 validation errors', () => {
        it('returns an array of length 6', () => {
          testValidation('xsd-invalid.xml', (messages) => {
            expect(Array.isArray(messages)).toBe(true);
            expect(messages.length).toEqual(6);
          });
        });
      });
    });

    describe('given a well-formed xml document with a correct ' +
      'reference to a valid ISO schematron schema', () => {
      describe('when the document is valid', () => {
        it('returns an empty array', () => {
          testValidation('iso-sch-valid.xml', (messages) => {
            expect(Array.isArray(messages)).toBe(true);
            expect(messages.length).toEqual(0);
          });
        });
      });

      describe('when the document contains 3 validation errors', () => {
        it('returns an array of length 3', () => {
          testValidation('iso-sch-invalid.xml', (messages) => {
            expect(Array.isArray(messages)).toBe(true);
            expect(messages.length).toEqual(3);
          });
        });
      });
    });

    describe('given a well-formed xml document with a correct ' +
      'reference to a valid schematron 1.5 schema', () => {
      describe('when the document is valid', () => {
        it('returns an empty array', () => {
          testValidation('15-sch-valid.xml', (messages) => {
            expect(Array.isArray(messages)).toBe(true);
            expect(messages.length).toEqual(0);
          });
        });
      });

      describe('when the document contains 3 validation errors', () => {
        it('returns an array of length 3', () => {
          testValidation('15-sch-invalid.xml', (messages) => {
            expect(Array.isArray(messages)).toBe(true);
            expect(messages.length).toEqual(3);
          });
        });
      });
    });

    describe('given a well-formed xml document with a correct ' +
      'reference to a valid RNG and a valid iso schematron schema', () => {
      describe('when the document is valid', () => {
        it('returns an empty array', () => {
          testValidation('rng-iso-sch-valid.xml', (messages) => {
            expect(Array.isArray(messages)).toBe(true);
            expect(messages.length).toEqual(0);
          });
        });
      });

      describe('when the document contains 8 validation errors', () => {
        it('returns an array of length 8', () => {
          testValidation('rng-iso-sch-invalid.xml', (messages) => {
            expect(Array.isArray(messages)).toBe(true);
            expect(messages.length).toEqual(8);
          });
        });
      });
    });

    describe('given a well-formed xml document with correct ' +
      'RNG and ISO schematron references to an RNG file with embedded schematron rules', () => {
      describe('when the document is valid', () => {
        it('returns an empty array', () => {
          testValidation('rng-embedded-iso-sch-valid.xml', (messages) => {
            expect(Array.isArray(messages)).toBe(true);
            expect(messages.length).toEqual(0);
          });
        });
      });

      describe('when the document contains 8 validation errors', () => {
        it('returns an array of length 8', () => {
          testValidation('rng-embedded-iso-sch-invalid.xml', (messages) => {
            expect(Array.isArray(messages)).toBe(true);
            expect(messages.length).toEqual(8);
          });
        });
      });
    });

    describe('given a well-formed xml document with correct ' +
      'RNG and schematron 1.5 references to an RNG file with embedded schematron rules', () => {
      describe('when the document is valid', () => {
        it('returns an empty array', () => {
          testValidation('rng-embedded-15-sch-valid.xml', (messages) => {
            expect(Array.isArray(messages)).toBe(true);
            expect(messages.length).toEqual(0);
          });
        });
      });

      describe('when the document contains 8 validation errors', () => {
        it('returns an array of length 8', () => {
          testValidation('rng-embedded-15-sch-invalid.xml', (messages) => {
            expect(Array.isArray(messages)).toBe(true);
            expect(messages.length).toEqual(8);
          });
        });
      });
    });

    describe('given a well-formed xml document with a correct ' +
      'RNG reference to a not well-formed RNG file', () => {
      it('returns an array containing a warning', () => {
        testValidation('rng-notwellformed.xml', (messages) => {
          expect(Array.isArray(messages)).toBe(true);
          expect(messages.length).toEqual(1);
          expect(messages[0].type).toEqual('Warning');
        });
      });
    });

    describe('given a well-formed xml document with a correct ' +
      'schematron reference to an RNG file with embedded schematron rules and an ' +
      'include element with a wrong path', () => {
      it('returns an array containing a warning', () => {
        testValidation('rng-embedded-iso-sch-wronginclude.xml', (messages) => {
          expect(Array.isArray(messages)).toBe(true);
          expect(messages.length).toEqual(1);
          expect(messages[0].type).toEqual('Warning');
        });
      });
    });

    describe('given a well-formed xml document with a correct ' +
      'RNG reference to an RNG file containing an include element with a wrong path', () => {
      it('returns an array containing a warning', () => {
        testValidation('rng-schema-wronginclude.xml', (messages) => {
          expect(Array.isArray(messages)).toBe(true);
          expect(messages.length).toEqual(1);
          expect(messages[0].type).toEqual('Warning');
        });
      });
    });

    describe('given a well-formed xml document with a correct ' +
      'schematron reference to a not well-formed RNG file with embedded schematron rules', () => {
      it('returns an array containing a warning', () => {
        testValidation('rng-embedded-iso-sch-notwellformed.xml', (messages) => {
          expect(Array.isArray(messages)).toBe(true);
          expect(messages.length).toEqual(1);
          expect(messages[0].type).toEqual('Warning');
        });
      });
    });

    describe('given a well-formed xml document with a correct ' +
      'reference to a DTD', () => {
      describe('when the document is valid', () => {
        it('returns an empty array', () => {
          testValidation('dtd-valid.xml', (messages) => {
            expect(Array.isArray(messages)).toBe(true);
            expect(messages.length).toEqual(0);
          });
        });
      });

      describe('when the document contains 5 validation errors', () => {
        it('returns an array of length 5', () => {
          testValidation('dtd-invalid.xml', (messages) => {
            expect(Array.isArray(messages)).toBe(true);
            expect(messages.length).toEqual(5);
          });
        });
      });
    });

    describe('given a well-formed xml document with a correct ' +
      'embedded DTD', () => {
      describe('when the document is valid', () => {
        it('returns an empty array', () => {
          testValidation('dtd-embedded-valid.xml', (messages) => {
            expect(Array.isArray(messages)).toBe(true);
            expect(messages.length).toEqual(0);
          });
        });
      });

      describe('when the document contains 5 validation errors', () => {
        it('returns an array of length 5', () => {
          testValidation('dtd-embedded-invalid.xml', (messages) => {
            expect(Array.isArray(messages)).toBe(true);
            expect(messages.length).toEqual(5);
          });
        });
      });
    });

    describe('given a well-formed xml document with a correct ' +
      'reference to a valid RNG and correct system reference to a valid DTD', () => {
      describe('when the document is valid', () => {
        it('returns an empty array', () => {
          testValidation('rng-dtd-system-valid.xml', (messages) => {
            expect(Array.isArray(messages)).toBe(true);
            expect(messages.length).toEqual(0);
          });
        });
      });

      describe('when the document contains 9 validation errors', () => {
        it('returns an array of length 9', () => {
          testValidation('rng-dtd-system-invalid.xml', (messages) => {
            expect(Array.isArray(messages)).toBe(true);
            expect(messages.length).toEqual(9);
          });
        });
      });
    });

    describe('given a well-formed xml document with a correct ' +
      'reference to a valid RNG and correct public reference to a valid DTD', () => {
      describe('when the document is valid', () => {
        it('returns an empty array', () => {
          testValidation('rng-dtd-public-valid.xml', (messages) => {
            expect(Array.isArray(messages)).toBe(true);
            expect(messages.length).toEqual(0);
          });
        });
      });

      describe('when the document contains 9 validation errors', () => {
        it('returns an array of length 9', () => {
          testValidation('rng-dtd-public-invalid.xml', (messages) => {
            expect(Array.isArray(messages)).toBe(true);
            expect(messages.length).toEqual(9);
          });
        });
      });
    });

    describe('given a well-formed xml document with a correct ' +
      'reference to a valid XSD and a valid DTD', () => {
      describe('when the document is valid', () => {
        it('returns an empty array', () => {
          testValidation('xsd-dtd-valid.xml', (messages) => {
            expect(Array.isArray(messages)).toBe(true);
            expect(messages.length).toEqual(0);
          });
        });
      });

      describe('when the document contains 10 validation errors', () => {
        it('returns an array of length 10', () => {
          testValidation('xsd-dtd-invalid.xml', (messages) => {
            expect(Array.isArray(messages)).toBe(true);
            expect(messages.length).toEqual(10);
          });
        });
      });
    });

    describe('given a well-formed xml document with correct ' +
      'XSD and schematron references to an XSD file with embedded schematron rules', () => {
      describe('when the document is valid', () => {
        it('returns an empty array', () => {
          testValidation('xsd-embedded-iso-sch-valid.xml', (messages) => {
            expect(Array.isArray(messages)).toBe(true);
            expect(messages.length).toEqual(0);
          });
        });
      });

      describe('when the document contains 9 validation errors', () => {
        it('returns an array of length 9', () => {
          testValidation('xsd-embedded-iso-sch-invalid.xml', (messages) => {
            expect(Array.isArray(messages)).toBe(true);
            expect(messages.length).toEqual(9);
          });
        });
      });
    });
  });

  describe('XML Catalogs', () => {
    describe('provided with a reference to a non-existent XML catalog', () => {
      beforeEach(() => {
        waitsForPromise(() =>
          atom.packages.activatePackage('linter-jing')
        );
        atom.config.set('linter-jing.xmlCatalog', catalogPath('missing-catalog.xml'));
      });

      describe('given a well-formed xml document with a correct reference to a valid ' +
        'RNG schema in an xml-model processing instruction which needs to get resolved ' +
        'with a catalog file', () => {
        it('returns an array containing a warning', () => {
          testValidation('catalog-rng-valid.xml', (messages) => {
            expect(Array.isArray(messages)).toBe(true);
            expect(messages.length).toEqual(1);
            expect(messages[0].type).toEqual('Warning');
          });
        });
      });
    });

    describe('provided with a reference to a not well-formed XML catalog', () => {
      beforeEach(() => {
        waitsForPromise(() =>
          atom.packages.activatePackage('linter-jing')
        );
        atom.config.set('linter-jing.xmlCatalog', catalogPath('catalog-not-well-formed.xml'));
      });

      describe('given a well-formed xml document with a correct reference to a valid ' +
        'RNG schema in an xml-model processing instruction which needs to get resolved ' +
        'with a catalog file', () => {
        it('returns an array containing a warning', () => {
          testValidation('catalog-rng-valid.xml', (messages) => {
            expect(Array.isArray(messages)).toBe(true);
            expect(messages.length).toEqual(1);
            expect(messages[0].type).toEqual('Warning');
          });
        });
      });
    });

    describe('provided with a catalog reference to an XML file that\s not a catalog', () => {
      beforeEach(() => {
        waitsForPromise(() =>
          atom.packages.activatePackage('linter-jing')
        );
        atom.config.set('linter-jing.xmlCatalog', catalogPath('not-a-catalog.xml'));
      });

      describe('given a well-formed xml document with a correct reference to a valid ' +
        'RNG schema in an xml-model processing instruction which needs to get resolved ' +
        'with a catalog file', () => {
        it('returns an array containing a warning', () => {
          testValidation('catalog-rng-valid.xml', (messages) => {
            expect(Array.isArray(messages)).toBe(true);
            expect(messages.length).toEqual(1);
            expect(messages[0].type).toEqual('Warning');
          });
        });
      });
    });

    describe('provided with a reference to a valid XML catalog', () => {
      beforeEach(() => {
        waitsForPromise(() =>
          atom.packages.activatePackage('linter-jing')
        );
        atom.config.set('linter-jing.xmlCatalog', catalogPath('catalog.xml'));
      });

      describe('given a well-formed xml document with a correct reference to a valid ' +
        'RNG schema in an xml-model processing instruction which needs to get resolved ' +
        'with a catalog file', () => {
        describe('when the document is valid', () => {
          it('returns an empty array', () => {
            testValidation('catalog-rng-valid.xml', (messages) => {
              expect(Array.isArray(messages)).toBe(true);
              expect(messages.length).toEqual(0);
            });
          });
        });

        describe('when the document contains 5 validation errors', () => {
          it('returns an array of length 5', () => {
            testValidation('catalog-rng-invalid.xml', (messages) => {
              expect(Array.isArray(messages)).toBe(true);
              expect(messages.length).toEqual(5);
            });
          });
        });
      });
    });

    describe('given a well-formed xml document with a correct ' +
      'xml-model reference to a valid XSD schema which needs to get ' +
      'resolved with a catalog', () => {
      describe('when the document is valid', () => {
        it('returns an empty array', () => {
          testValidation('catalog-xsd-xmlmodel-valid.xml', (messages) => {
            expect(Array.isArray(messages)).toBe(true);
            expect(messages.length).toEqual(0);
          });
        });
      });
      describe('when the document contains 6 validation errors', () => {
        it('returns an array of length 6', () => {
          testValidation('catalog-xsd-xmlmodel-invalid.xml', (messages) => {
            expect(Array.isArray(messages)).toBe(true);
            expect(messages.length).toEqual(6);
          });
        });
      });
    });

    describe('given a well-formed xml document with a correct ' +
      'reference to a valid XSD schema which needs to get resolved with a catalog ' +
      'and includes another schema which needs to get resolved with a catalog', () => {
      describe('when the document is valid', () => {
        it('returns an empty array', () => {
          testValidation('catalog-xsd-valid.xml', (messages) => {
            expect(Array.isArray(messages)).toBe(true);
            expect(messages.length).toEqual(0);
          });
        });
      });

      describe('when the document contains 6 validation errors', () => {
        it('returns an array of length 6', () => {
          testValidation('catalog-xsd-invalid.xml', (messages) => {
            expect(Array.isArray(messages)).toBe(true);
            expect(messages.length).toEqual(6);
          });
        });
      });
    });

    describe('given a well-formed xml document with a correct ' +
      'reference to a valid XSD and a valid DTD which both need to get resolved ' +
      'with a catalog', () => {
      describe('when the document is valid', () => {
        it('returns an empty array', () => {
          testValidation('catalog-xsd-dtd-valid.xml', (messages) => {
            expect(Array.isArray(messages)).toBe(true);
            expect(messages.length).toEqual(0);
          });
        });
      });

      describe('when the document contains 10 validation errors', () => {
        it('returns an array of length 10', () => {
          testValidation('catalog-xsd-dtd-invalid.xml', (messages) => {
            expect(Array.isArray(messages)).toBe(true);
            expect(messages.length).toEqual(10);
          });
        });
      });
    });
  });

  it('%%% pseudo after all %%%', () => {
    exitServer();
  });
});