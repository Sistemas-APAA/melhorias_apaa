/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 */
define(['N/search', 'N/log', 'N/format', 'N/record'], (search, log, format, record) => {

  const execute = (context) => {
    const today = new Date();

    const todayFormatted = format.format({
      value: today,
      type: format.Type.DATE
    });

    const employeeSearch = search.create({
      type: search.Type.EMPLOYEE,
      filters: [
        ['giveaccess', 'is', 'T'],
        'AND',
        ['isinactive', 'is', 'F'],
        'AND',
        ['custentity_bit_delegate_de', 'onorbefore', todayFormatted],
        'AND',
        ['custentity_bit_delegate_ate', 'onorafter', todayFormatted]
      ],
      columns: [
        'internalid',
        'entityid',
        'giveaccess',
        'custentity_bit_delegate_de',
        'custentity_bit_delegate_ate'
      ]
    });

    employeeSearch.run().each(result => {
      const id = result.getValue({ name: 'internalid' });
      const name = result.getValue({ name: 'entityid' });

      try {
        // Carrega o registro de funcionário
        const employeeRecord = record.load({
          type: record.Type.EMPLOYEE,
          id: id
        });

        // Atualiza o campo custentity_funcionario_ausente para true (checkbox)
        employeeRecord.setValue({
          fieldId: 'custentity_funcionario_ausente',
          value: true
        });

        employeeRecord.save();

        log.audit('Funcionário atualizado', {
          ID: id,
          Nome: name,
          Atualizado: 'custentity_funcionario_ausente = true'
        });
      } catch (e) {
        log.error('Erro ao atualizar funcionário', {
          ID: id,
          Nome: name,
          Erro: e.message
        });
      }

      return true; // continua iteração
    });
  };

  return { execute };
});
