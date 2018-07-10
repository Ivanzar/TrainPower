function calculate()
{
    var accounts = $("textarea").val().split(",");
    var sum = 0;
    var dirtySum = 0;
    var delegatedSum = 0;
    var receivedSum = 0;
    var out;

    golos.api.getAccounts(accounts, function (err, result)
    {
        console.log(result);
        if (!err)
        {
            result.forEach(function (item)
            {
                dirtySum += parseFloat(item.vesting_shares.split(' ')[0]);
                delegatedSum += parseFloat(item.delegated_vesting_shares.split(' ')[0]);
                receivedSum += parseFloat(item.received_vesting_shares.split(' ')[0]);

                sum += parseFloat(item.vesting_shares.split(' ')[0])
                        + parseFloat(item.received_vesting_shares.split(' ')[0])
                        - parseFloat(item.delegated_vesting_shares.split(' ')[0]);
            });
        } else
            console.error(err);

        if (sum === 0)
        {
            out = "Список участников введен неверно!";
            $("#out").html(out);
        } else
        {
            console.log(sum);
            golos.api.getDynamicGlobalProperties(function (err, result)
            {
                console.log(result);

                var totalShares = result.total_vesting_shares.split(' ')[0];
                var totoalFund = result.total_vesting_fund_steem.split(' ')[0];

                var out = totoalFund * (sum / totalShares);
                out *= 1000;
                out = Math.round(out);
                out /= 1000;

                var dirtyOut = totoalFund * (dirtySum / totalShares);
                dirtyOut *= 1000;
                dirtyOut = Math.round(dirtyOut);
                dirtyOut /= 1000;
                
                delegatedSum = totoalFund * (delegatedSum / totalShares);
                delegatedSum *= 1000;
                delegatedSum = Math.round(delegatedSum);
                delegatedSum /= 1000;
                
                receivedSum = totoalFund * (receivedSum / totalShares);
                receivedSum *= 1000;
                receivedSum = Math.round(receivedSum);
                receivedSum /= 1000;

                $("#out").html("Общая сила: " + out + " GOLOS "
                        + "<br> Общая сила без учета делегирования: " + dirtyOut + " GOLOS "
                        + "<br> Всего делегировано участниками: " + delegatedSum + " GOLOS "
                        + "<br> Всего делегировано участникам: " + receivedSum + " GOLOS");
            });
        }

    });
}

